import os

import cv2
from numpy import ndarray, flip, squeeze
from backend.settings import BASE_DIR, MEDIA_ROOT, MODEL_DIR
from mrcnn.config import Config
from mrcnn.model import MaskRCNN
from .models import Image

DEFAULT_MODEL_DIR = os.path.join(BASE_DIR, 'ml-model/mask_rcnn_coco.h5')

class MLModelConfig(Config):
    # Give the configuration a recognizable name
    NAME = "coco_inference"
    CLASS_NAMES = ['BG', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']
    
    # set the number of GPUs to use along with the number of images per GPU
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1

    # Number of classes = number of classes + 1 (+1 for the background). The background class is named BG
    NUM_CLASSES = len(CLASS_NAMES)

    def __init__(self, name: str = '', class_names: list[str] = []):
        super().__init__()
        if name != '':
            self.NAME = name
        
        if len(class_names) > 0:
            self.CLASS_NAMES = class_names

class MRCNNImageEngine():
    def __init__(self, image: Image):
        self.image = image
        if self.image.project.file_weight:
            self.config = MLModelConfig(
                name=self.image.project.title,
                class_name=self.image.project.class_list
            )
        else:
            self.config = MLModelConfig()

    def inferenceSegmentation(self):
        model = MaskRCNN(
            mode='inference',
            config=self.config,
            model_dir=MODEL_DIR
        )
        if self.image.project.file_weight:
            model_path = os.path.join(MEDIA_ROOT, self.image.project.file_weight.path)
        else:
            model_path = DEFAULT_MODEL_DIR
        model.load_weights(
            filepath=model_path,
            by_name=True)

        image = cv2.imread(self.image.file.path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        r = model.detect([image])[0]

        res = []

        classResult = r['class_ids']
        masks = r['masks']

        for i in range(len(classResult)):
            mask: ndarray = masks[:,:,i]
            maskSize = mask.shape
            points = []
            polygonInPixels, _ = cv2.findContours(
                mask.astype('uint8'),
                cv2.RETR_EXTERNAL,
                cv2.CHAIN_APPROX_SIMPLE
            )
            for verts in polygonInPixels:
                verts = squeeze(verts)
                vertsInRatio: ndarray = verts / flip(maskSize)
                points.extend(vertsInRatio.tolist())
            res.append({
                'type': 'polygon',
                'id': 'polygon'+ str(i),
                'cls': self.config.CLASS_NAMES[classResult[i]],
                'points': points
            })
        self.image.polygons = res
        self.image.save()

    def inferenceBox(self):
        model = MaskRCNN(
            mode='inference',
            config=self.config,
            model_dir=MODEL_DIR
        )
        if self.image.project.file_weight:
            model_path = os.path.join(MEDIA_ROOT, self.image.project.file_weight.path)
        else:
            model_path = DEFAULT_MODEL_DIR
        model.load_weights(
            filepath=model_path,
            by_name=True)

        image = cv2.imread(self.image.path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        r = self.model.detect([image])[0]

        res = {
            "src": self.image.url,
            "name" : self.project.title,
            "regions": []
        }

        classResult = r['class_ids']
        boundingBox = r['rois']
        height, width = image.shape[:2]

        for i in range(len(classResult)):
            y1, x1, y2, x2 = boundingBox[i]
            res['regions'].append({
                'type': 'box',
                'id': 'box'+ str(i),
                'cls': self.config.CLASS_NAMES[classResult[i]],
                'x': x1 / width,
                'y': y1 / height,
                'h': (y2 - y1) / height,
                'w': (x2 - x1) / width
            })
        self.image.boxes = res
        self.image.save()
