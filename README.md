<p align="center"><img width="300" src="https://github.com/user-attachments/assets/c18a0981-a803-422c-9c4c-fcaafb118c0a"></p>

本插件是对该视频（`https://www.bilibili.com/video/BV1AC4y1D7QH`）中提出的 PS 多图层选区内容自由变换原理的自动化实现方案，旨在帮助用户解决重复操作的烦恼，弥补 PS 一直以来没有实现的同时对多个图层指定选区内容进行处理的能力

## 兼容性

- Windows：最低支持 Photoshop CC 2019(version 20.0.0)
- Mac：因设备受限未能在 Mac 中测试，但 CEP 扩展插件为通用型插件，理论上选择与 Win 中相同版本的 Mac 版 PS 亦可使用

## 注意事项

- 本人技术有限，无法保证插件百分百没有 Bug 存在，如介意请谨慎选择使用
- 插件原理是保存选区并循环对所选图层逐一应用“再次变换”功能以达到最终效果，而非 SAI2 那样的实现方式，如介意请谨慎选择使用
- Win7 4G 内存 4 核心虚拟机中测试如下，Photoshop CC 2020 操作 100 个以上图层需花费 50 秒左右，如介意请谨慎选择使用
- 综合上述，本插件实现的比较粗糙，最大目的是帮助用户省去繁琐的手动操作，而非复刻其他软件（如 SAI2）中相应的功能到 PS
- 所以，建议在日常练习时使用本插件，或在草稿阶段图层不多的情况下使用，如果是重要稿件，请务必做好 PSD 文件的备份

## 免责声明

- 本插件完全开源免费，项目源码公平公开，如有疑问，可自行前往查阅核实
- 如因使用本插件而造成用户 Photoshop 项目文件（如 PSD 文件）受损，需用户自行承担后果
- 安装使用本插件即代表同意并接受上述声明

## 安装说明

**链接**

- Github：https://github.com/Jayvin-Leung/Photoshop-EX-Transform/releases
- Gitee：https://gitee.com/Jayvin_Leung/Photoshop-EX-Transform/releases

**步骤**

- 打开上方链接，选择最新版本的`Photoshop-EX-Transform.zip`文件，下载并解压出`Photoshop-EX-Transform`文件夹
- 将`Photoshop-EX-Transform`文件夹放到`PS安装目录\Required\CEP\extensions`文件夹中
- 重新打开 PS，选择“窗口”-“扩展功能”-“EX-自由变换”，可以正常打开即代表安装插件成功

## 使用说明

**步骤**

- 建立选区
- 选择需操作的图层（**注意：对选中的隐藏图层亦有影响**）
  - 无法操作的图层类型：
  - 锁定位置或锁定全部的图层
  - 文字图层
  - 形状图层
  - 智能对象图层
- 点击“EX-自由变换”插件面板中的“自由变换”按钮
- 确认完成后，等待插件对所选图层逐一操作，等待期间不要进行其他操作
- 完成后，“历史记录”面板中会记录名为“ex-transform”的一步操作
- 不满意结果的话需要回退到前一步再进行上述的操作（**注意：这里使用快捷键后退可能需要按两次**）

**展示**

- 不符合条件的情况

![Snipaste_2025-03-28_20-17-52_提示一](https://github.com/user-attachments/assets/92f3eb52-c19b-4f0f-bbd3-8c1518036aa2)
![Snipaste_2025-03-28_20-20-56_提示二](https://github.com/user-attachments/assets/06710715-5444-44ad-8336-2216ec6bb8ae)
![Snipaste_2025-03-28_20-22-02_提示三](https://github.com/user-attachments/assets/7cf57606-ff51-40c8-aee1-8c6b4f71fe13)

- 进入“EX-自由变换”

![Snipaste_2025-03-28_20-22-48_进入自由变换](https://github.com/user-attachments/assets/5390b9c3-ed68-4aef-b526-75d61d9699d3)

- “EX-自由变换”处理中

![Snipaste_2025-03-28_20-23-13_自由变化中](https://github.com/user-attachments/assets/2cfcd6c8-2e4c-4507-9457-38fcd1b72b2c)

- “EX-自由变换”完成

![Snipaste_2025-03-28_20-23-28_自由变换完成](https://github.com/user-attachments/assets/59a19ad5-3e41-4c55-bd17-1eb2d1043274)

## 后续计划

- 后面会尝试复刻 SAI2 中的“自由变换”功能到 PS，但会根据性能问题决定是否上线

## 参考&感谢

- @emptykid：https://uiscripting.com/
- https://github.com/Adobe-CEP
