
from typing import Tuple, TypedDict


class CocoInfoType(TypedDict):
    year: int
    version: str
    description: str
    contributor: str
    url: str
    date_created: str

class CocoImageType(TypedDict):
    id: int
    width: int
    height: int
    file_name: str
    license: int
    flickr_url: str
    coco_url: str
    date_captured: str

class CocoLicenseType(TypedDict):
    id: int
    name: str
    url: str

class CocoAnnotationType(TypedDict):
    id: int
    image_id: int
    category_id: int
    segmentation: Tuple
    area: float
    bbox: Tuple[int, int, int, int ]
    iscrowd: int

class CocoCategoryType(TypedDict):
    id: int
    name: str
    supercategory: str

class CocoDatasetType(TypedDict):
    info: CocoInfoType
    images: Tuple[CocoImageType]
    annotations: Tuple[CocoAnnotationType]
    licenses: Tuple[CocoLicenseType]
    categories: Tuple[CocoCategoryType]
