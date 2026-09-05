import json
from datetime import datetime
from pathlib import Path

from PIL import Image
from PIL.ExifTags import IFD, TAGS

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
DATE_TAGS = ("DateTimeOriginal", "DateTime", "DateTimeDigitized")

def get_exif_data(image_path):
    """获取图片的EXIF数据"""
    with Image.open(image_path) as image:
        raw_exif = image._getexif() or {}
        exif_data = {TAGS.get(tag, tag): value for tag, value in raw_exif.items()}

        try:
            exif_ifd = image.getexif().get_ifd(IFD.Exif)
        except (AttributeError, KeyError, TypeError):
            exif_ifd = {}

        exif_data.update({TAGS.get(tag, tag): value for tag, value in exif_ifd.items()})
        return exif_data

def dms_to_decimal(degrees, minutes, seconds):
    """将度分秒转换为十进制"""
    return float(degrees) + (float(minutes) / 60) + (float(seconds) / 3600)

def get_gps_value(gps_info, numeric_key, text_key):
    return gps_info.get(numeric_key, gps_info.get(text_key))

def extract_coordinates(exif_data):
    """从EXIF数据中提取十进制经纬度"""
    gps_info = exif_data.get("GPSInfo")
    if not gps_info:
        raise ValueError("missing GPSInfo")

    lat_values = get_gps_value(gps_info, 2, "GPSLatitude")
    lon_values = get_gps_value(gps_info, 4, "GPSLongitude")
    lat_ref = get_gps_value(gps_info, 1, "GPSLatitudeRef")
    lon_ref = get_gps_value(gps_info, 3, "GPSLongitudeRef")

    if lat_values is None or lon_values is None or lat_ref is None or lon_ref is None:
        raise ValueError("incomplete GPSInfo")

    latitude = dms_to_decimal(*lat_values)
    longitude = dms_to_decimal(*lon_values)
    if lat_ref == "S":
        latitude = -latitude
    if lon_ref == "W":
        longitude = -longitude

    return latitude, longitude

def parse_exif_datetime(value):
    if isinstance(value, bytes):
        value = value.decode(errors="ignore")
    value = str(value).strip().replace("\x00", "")[:19]

    for date_format in ("%Y:%m:%d %H:%M:%S", "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(value, date_format)
        except ValueError:
            continue

    raise ValueError(f"unsupported EXIF date format: {value!r}")

def extract_photo_month(exif_data):
    """优先使用原始拍摄时间，并只输出到月份以减少隐私暴露"""
    for tag in DATE_TAGS:
        if exif_data.get(tag):
            return parse_exif_datetime(exif_data[tag]).strftime("%Y-%m")
    raise ValueError("missing EXIF date")

def generate_photo_data(folder_path):
    """生成图片数据"""
    photo_data = []
    skipped_files = []
    for full_path in sorted(Path(folder_path).iterdir(), key=lambda path: path.name.lower()):
        if full_path.suffix.lower() in IMAGE_EXTENSIONS:
            file_name = full_path.name
            exif_data = get_exif_data(full_path)

            try:
                latitude, longitude = extract_coordinates(exif_data)
                date = extract_photo_month(exif_data)
            except (IndexError, TypeError, ValueError) as error:
                skipped_files.append(f"{file_name}: {error}")
                continue

            data = {
                "file": f"images/coordinates_photos/{file_name}",
                "lat": latitude,
                "lng": longitude,
                "place": full_path.stem,
                "date": date,
                "datePrecision": "month"
            }
            photo_data.append(data)
    return photo_data, skipped_files

def main():
    folder_path = Path(__file__).resolve().parent
    output_path = folder_path / "coordinates_photos.json"
    photo_data, skipped_files = generate_photo_data(folder_path)

    with output_path.open('w', encoding='utf-8') as f:
        json.dump(photo_data, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(photo_data)} entries to {output_path}")
    if skipped_files:
        print("Skipped files:")
        for item in skipped_files:
            print(f"  - {item}")

if __name__ == "__main__":
    main()
