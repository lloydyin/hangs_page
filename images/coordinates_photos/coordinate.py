import os
from PIL import Image
from PIL.ExifTags import TAGS
import json
from datetime import datetime

# 提前定义坐标信息
coordinates = {
    "paris.jpg": {"lat": 48.8566, "lng": 2.3522, "caption": "Eiffel Tower!"},
    "tokyo.jpg": {"lat": 35.6895, "lng": 139.6917, "caption": "Shibuya Crossing"}
}

def get_exif_data(image_path):
    """获取图片的EXIF数据"""
    image = Image.open(image_path)
    exif_data = image._getexif()
    if exif_data is not None:
        # 将EXIF数据转化为字典
        return {TAGS.get(tag): value for tag, value in exif_data.items() if tag in TAGS}
    return {}

def dms_to_decimal(degrees, minutes, seconds):
    """将度分秒转换为十进制"""
    return degrees + (minutes / 60) + (seconds / 3600)

def generate_photo_data(folder_path):
    """生成图片数据"""
    photo_data = []
    for file_name in os.listdir(folder_path):
        if file_name.lower().endswith(('.jpg', '.jpeg', '.png')):  # 支持常见图片格式
            # Get EXIF Data
            full_path = os.path.join(folder_path, file_name)
            exif_data = get_exif_data(full_path)
            # Coordinates
            coordinates = exif_data["GPSInfo"]
            lat_degrees, lat_minutes, lat_seconds = coordinates[2]
            lon_degrees, lon_minutes, lon_seconds = coordinates[4]
            latitude = dms_to_decimal(lat_degrees, lat_minutes, lat_seconds)
            longitude = dms_to_decimal(lon_degrees, lon_minutes, lon_seconds)
            if coordinates[1] == 'S':
                latitude = -latitude
            if coordinates[3] == 'W':
                longitude = -longitude
            latitude = float(latitude)
            longitude = float(longitude)
            # Date
            date = exif_data["DateTime"]
            date_obj = datetime.strptime(date, '%Y:%m:%d %H:%M:%S')
            date = date_obj.strftime('%m/%d/%Y')
            # 获取对应的坐标信息
            #if file_name in coordinates:
            temp_path = os.path.join("images/coordinates_photos/", file_name)
            data = {
                "file": temp_path,
                "lat": latitude,
                "lng": longitude,
                "place": os.path.splitext(file_name)[0],
                "date": date
            }
            photo_data.append(data)
    return photo_data

def main():
    folder_path = r"D:\Study\Code\Person Website\images\coordinates_photos"  # 设置文件夹路径
    photo_data = generate_photo_data(folder_path)
    # 输出为JSON格式
    # print("const photoData = ", json.dumps(photo_data, indent=2))
    with open('D:/Study/Code/Person Website/images/coordinates_photos/coordinates_photos.json', 'w', encoding='utf-8') as f:
        json.dump(photo_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
