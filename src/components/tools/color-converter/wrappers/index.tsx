/**
 * Auto-generated wrapper components for all color conversion combinations.
 * Each wrapper passes specific fromFormat and toFormat props to ColorConverterTool.
 */

import {
  ColorConverterTool,
  type ConverterFormat,
} from "../ColorConverterTool";

/**
 * Creates a wrapper component for a specific conversion.
 */
function createWrapper(from: ConverterFormat, to: ConverterFormat) {
  return function Wrapper() {
    return <ColorConverterTool fromFormat={from} toFormat={to} />;
  };
}

// HEX to X
export const HexToRgbTool = createWrapper("hex", "rgb");
export const HexToRgbaTool = createWrapper("hex", "rgba");
export const HexToHslTool = createWrapper("hex", "hsl");
export const HexToHslaTool = createWrapper("hex", "hsla");
export const HexToHsvTool = createWrapper("hex", "hsv");
export const HexToHsvaTool = createWrapper("hex", "hsva");
export const HexToCmykTool = createWrapper("hex", "cmyk");
export const HexToLabTool = createWrapper("hex", "lab");
export const HexToLchTool = createWrapper("hex", "lch");
export const HexToOklchTool = createWrapper("hex", "oklch");

// RGB to X
export const RgbToHexTool = createWrapper("rgb", "hex");
export const RgbToRgbaTool = createWrapper("rgb", "rgba");
export const RgbToHslTool = createWrapper("rgb", "hsl");
export const RgbToHslaTool = createWrapper("rgb", "hsla");
export const RgbToHsvTool = createWrapper("rgb", "hsv");
export const RgbToHsvaTool = createWrapper("rgb", "hsva");
export const RgbToCmykTool = createWrapper("rgb", "cmyk");
export const RgbToLabTool = createWrapper("rgb", "lab");
export const RgbToLchTool = createWrapper("rgb", "lch");
export const RgbToOklchTool = createWrapper("rgb", "oklch");

// RGBA to X
export const RgbaToHexTool = createWrapper("rgba", "hex");
export const RgbaToRgbTool = createWrapper("rgba", "rgb");
export const RgbaToHslTool = createWrapper("rgba", "hsl");
export const RgbaToHslaTool = createWrapper("rgba", "hsla");
export const RgbaToHsvTool = createWrapper("rgba", "hsv");
export const RgbaToHsvaTool = createWrapper("rgba", "hsva");
export const RgbaToCmykTool = createWrapper("rgba", "cmyk");
export const RgbaToLabTool = createWrapper("rgba", "lab");
export const RgbaToLchTool = createWrapper("rgba", "lch");
export const RgbaToOklchTool = createWrapper("rgba", "oklch");

// HSL to X
export const HslToHexTool = createWrapper("hsl", "hex");
export const HslToRgbTool = createWrapper("hsl", "rgb");
export const HslToRgbaTool = createWrapper("hsl", "rgba");
export const HslToHslaTool = createWrapper("hsl", "hsla");
export const HslToHsvTool = createWrapper("hsl", "hsv");
export const HslToHsvaTool = createWrapper("hsl", "hsva");
export const HslToCmykTool = createWrapper("hsl", "cmyk");
export const HslToLabTool = createWrapper("hsl", "lab");
export const HslToLchTool = createWrapper("hsl", "lch");
export const HslToOklchTool = createWrapper("hsl", "oklch");

// HSLA to X
export const HslaToHexTool = createWrapper("hsla", "hex");
export const HslaToRgbTool = createWrapper("hsla", "rgb");
export const HslaToRgbaTool = createWrapper("hsla", "rgba");
export const HslaToHslTool = createWrapper("hsla", "hsl");
export const HslaToHsvTool = createWrapper("hsla", "hsv");
export const HslaToHsvaTool = createWrapper("hsla", "hsva");
export const HslaToCmykTool = createWrapper("hsla", "cmyk");
export const HslaToLabTool = createWrapper("hsla", "lab");
export const HslaToLchTool = createWrapper("hsla", "lch");
export const HslaToOklchTool = createWrapper("hsla", "oklch");

// HSV to X
export const HsvToHexTool = createWrapper("hsv", "hex");
export const HsvToRgbTool = createWrapper("hsv", "rgb");
export const HsvToRgbaTool = createWrapper("hsv", "rgba");
export const HsvToHslTool = createWrapper("hsv", "hsl");
export const HsvToHslaTool = createWrapper("hsv", "hsla");
export const HsvToHsvaTool = createWrapper("hsv", "hsva");
export const HsvToCmykTool = createWrapper("hsv", "cmyk");
export const HsvToLabTool = createWrapper("hsv", "lab");
export const HsvToLchTool = createWrapper("hsv", "lch");
export const HsvToOklchTool = createWrapper("hsv", "oklch");

// HSVA to X
export const HsvaToHexTool = createWrapper("hsva", "hex");
export const HsvaToRgbTool = createWrapper("hsva", "rgb");
export const HsvaToRgbaTool = createWrapper("hsva", "rgba");
export const HsvaToHslTool = createWrapper("hsva", "hsl");
export const HsvaToHslaTool = createWrapper("hsva", "hsla");
export const HsvaToHsvTool = createWrapper("hsva", "hsv");
export const HsvaToCmykTool = createWrapper("hsva", "cmyk");
export const HsvaToLabTool = createWrapper("hsva", "lab");
export const HsvaToLchTool = createWrapper("hsva", "lch");
export const HsvaToOklchTool = createWrapper("hsva", "oklch");

// CMYK to X
export const CmykToHexTool = createWrapper("cmyk", "hex");
export const CmykToRgbTool = createWrapper("cmyk", "rgb");
export const CmykToRgbaTool = createWrapper("cmyk", "rgba");
export const CmykToHslTool = createWrapper("cmyk", "hsl");
export const CmykToHslaTool = createWrapper("cmyk", "hsla");
export const CmykToHsvTool = createWrapper("cmyk", "hsv");
export const CmykToHsvaTool = createWrapper("cmyk", "hsva");
export const CmykToLabTool = createWrapper("cmyk", "lab");
export const CmykToLchTool = createWrapper("cmyk", "lch");
export const CmykToOklchTool = createWrapper("cmyk", "oklch");

// LAB to X
export const LabToHexTool = createWrapper("lab", "hex");
export const LabToRgbTool = createWrapper("lab", "rgb");
export const LabToRgbaTool = createWrapper("lab", "rgba");
export const LabToHslTool = createWrapper("lab", "hsl");
export const LabToHslaTool = createWrapper("lab", "hsla");
export const LabToHsvTool = createWrapper("lab", "hsv");
export const LabToHsvaTool = createWrapper("lab", "hsva");
export const LabToCmykTool = createWrapper("lab", "cmyk");
export const LabToLchTool = createWrapper("lab", "lch");
export const LabToOklchTool = createWrapper("lab", "oklch");

// LCH to X
export const LchToHexTool = createWrapper("lch", "hex");
export const LchToRgbTool = createWrapper("lch", "rgb");
export const LchToRgbaTool = createWrapper("lch", "rgba");
export const LchToHslTool = createWrapper("lch", "hsl");
export const LchToHslaTool = createWrapper("lch", "hsla");
export const LchToHsvTool = createWrapper("lch", "hsv");
export const LchToHsvaTool = createWrapper("lch", "hsva");
export const LchToCmykTool = createWrapper("lch", "cmyk");
export const LchToLabTool = createWrapper("lch", "lab");
export const LchToOklchTool = createWrapper("lch", "oklch");

// OKLCH to X
export const OklchToHexTool = createWrapper("oklch", "hex");
export const OklchToRgbTool = createWrapper("oklch", "rgb");
export const OklchToRgbaTool = createWrapper("oklch", "rgba");
export const OklchToHslTool = createWrapper("oklch", "hsl");
export const OklchToHslaTool = createWrapper("oklch", "hsla");
export const OklchToHsvTool = createWrapper("oklch", "hsv");
export const OklchToHsvaTool = createWrapper("oklch", "hsva");
export const OklchToCmykTool = createWrapper("oklch", "cmyk");
export const OklchToLabTool = createWrapper("oklch", "lab");
export const OklchToLchTool = createWrapper("oklch", "lch");
