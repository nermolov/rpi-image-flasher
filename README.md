# RPi Image Flash Kiosk
Quick project to create an image flashing kiosk for Raspberry Pi Images, intended to run on a Raspberry Pi with a USB SD Card writer.

### Usage

1. Create the images/ directory
2. Download all of your images to flash
3. Edit image information at the top of ```main.js```
4. Run ```npm install```
5. Start ```node main.js``` as root
NOTE: Script is configured to write to ```/dev/sda``` as the device, please make sure that is your SD Card before using the script to prevent data loss.

### License

Copyright (c) 2016 Nicholas Ermolov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.