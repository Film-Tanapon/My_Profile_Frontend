export function recordTheme(color, dotColor, fontColor) {
  const dots = /^#[0-9a-f]{6}$/i.test(dotColor || "") ? { "--dot-color": dotColor } : {};
  const font = /^#[0-9a-f]{6}$/i.test(fontColor || "") ? { color: fontColor, "--ink": fontColor, "--muted": fontColor, "--coral": fontColor, "--purple": fontColor } : {};
  if (!/^#[0-9a-f]{6}$/i.test(color || "")) return Object.keys(dots).length || Object.keys(font).length ? { ...dots, ...font } : undefined;
  const [r,g,b] = color.slice(1).match(/../g).map(hex => parseInt(hex,16));
  const light = (r*299+g*587+b*114)/1000 > 155;
  return { ...dots, backgroundColor:color, color:light ? "#172033" : "#F3F4F7", "--ink":light ? "#172033" : "#F3F4F7", "--muted":light ? "#39485D" : "#D1D8E5", "--panel":light ? "#FFFFFF99" : "#10162399", "--line":light ? "#17203340" : "#FFFFFF40", "--coral":light ? "#273BA5" : "#B8CAFF", "--purple":light ? "#273BA5" : "#B8CAFF", ...font };
}
