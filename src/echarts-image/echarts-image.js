import echarts from "echarts";
import Canvas from "canvas";
import path from "path";

import "echarts/map/js/china";

class EchartsImage {
  _width;
  _height;

  constructor(width, height) {
    this._width = width || 500;
    this._height = height || 500;
    this._createEchart();
  }

  /** get base64 for image
   * @param options echarts options
   */
  getBase64(options) {
    this._chart.setOption(options);
    return this._chart.getDom().toDataURL();
  }

  _createEchart() {
    Canvas.registerFont(
      path.join("assets/fonts", "TengXiangMingSongJian-W1-2.ttf"),
      { family: "腾祥铭宋简-W1" }
    );
    if (!this._chart) {
      echarts.setCanvasCreator(() => {
        return Canvas.createCanvas(128, 128);
      });
      this._chart = echarts.init(
        Canvas.createCanvas(this._width, this._height)
      );
    }
  }
}

export default EchartsImage;
