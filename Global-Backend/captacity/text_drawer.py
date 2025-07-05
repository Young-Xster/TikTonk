from typing import Optional, Union, List
from moviepy.video.VideoClip import VideoClip, TextClip
from moviepy.video.compositing.CompositeVideoClip import CompositeVideoClip
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import numpy as np
from dataclasses import dataclass

@dataclass
class Word:
    text: str
    color: Optional[str] = None

    def set_color(self, color: str):
        self.color = color

@dataclass
class Character:
    text: str
    color: Optional[str] = None

class TextClipEx(TextClip):
    def __init__(self, text: str, fontsize: int, color: str = 'black', bg_color: str = None, font: str = None,
                 stroke_color: str = None, stroke_width: float = 0, kerning: float = 0, **kwargs):
        # Remove text parameter since we'll pass it directly
        text_params = {
            'text': text,  # TextClip now uses 'text' instead of 'txt' 
            'color': color,
            'font': font,
            'font_size': fontsize  # Add font_size parameter for PIL font
        }
        if bg_color is not None:
            text_params['bg_color'] = bg_color
        if stroke_color is not None and stroke_width > 0:
            text_params['stroke_color'] = stroke_color
            text_params['stroke_width'] = stroke_width
            
        # Call parent constructor with text parameters
        super().__init__(**text_params)
        
        # Store original parameters
        self.text = text
        self.fontsize = fontsize
        self.color = color
        self.font = font
        self.stroke_color = stroke_color
        self.stroke_width = stroke_width
        self.kerning = kerning

def get_text_size_ex(text: str, font: str, fontsize: int, stroke_width: float = 0) -> tuple[int, int]:
    text_clip = create_text_ex(text, fontsize=fontsize, color="white", font=font, stroke_width=stroke_width)
    return text_clip.size

def create_text_ex(text: Union[Word, str, List[Union[Word, Character]]], fontsize: int, color: str = 'white', font: str = None,
                bg_color: str = None, blur_radius: float = 0, opacity: float = 1.0,
                stroke_color: str = None, stroke_width: float = 0,
                kerning: float = 0) -> VideoClip:
    if isinstance(text, (Word, Character)):
        return create_text_chars([text], fontsize, color, font, bg_color, blur_radius, opacity, stroke_color, stroke_width, kerning)
    elif isinstance(text, str):
        return create_text(text, fontsize, color, font, bg_color, blur_radius, opacity, stroke_color, stroke_width, kerning)
    else:
        return create_text_chars(text, fontsize, color, font, bg_color, blur_radius, opacity, stroke_color, stroke_width, kerning)

def create_text(text: str, fontsize: int, color: str = 'white', font: str = None,
              bg_color: str = None, blur_radius: float = 0, opacity: float = 1.0,
              stroke_color: str = None, stroke_width: float = 0,
              kerning: float = 0) -> VideoClip:
    text_clip = TextClipEx(
        text=text,
        fontsize=fontsize,
        color=color,
        bg_color=bg_color,
        font=font,
        stroke_color=stroke_color,
        stroke_width=stroke_width,
        kerning=kerning
    )

    if opacity < 1.0:
        text_clip = text_clip.with_opacity(opacity)

    if blur_radius > 0:
        text_clip = blur_text_clip(text_clip, blur_radius)

    return text_clip

def create_text_chars(chars: List[Union[Word, Character]], fontsize: int, color: str = 'white',
                   font: str = None, bg_color: str = None,
                   blur_radius: float = 0, opacity: float = 1.0,
                   stroke_color: str = None, stroke_width: float = 0,
                   kerning: float = 0) -> VideoClip:
    text_clips = []
    x = 0

    for char in chars:
        clip = create_text(char.text, fontsize, char.color or color, font, bg_color, blur_radius, opacity, stroke_color, stroke_width)
        text_clips.append(clip.with_position((x, 0)))
        x += clip.size[0] + kerning

    height = max(c.size[1] for c in text_clips) if text_clips else 0
    return CompositeVideoClip(text_clips, size=(int(x), int(height)))

def blur_text_clip(clip: VideoClip, radius: int) -> VideoClip:
    def blur_frame(get_frame, t):
        img = Image.fromarray(get_frame(t))
        img = img.filter(ImageFilter.GaussianBlur(radius=radius))
        return np.array(img)

    return clip.transform(blur_frame)
