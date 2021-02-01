/* image process functions */
function loadimage(e) {
    let image = e.target;
    if (image.naturalWidth && image.naturalHeight) {
        imgwidth = parseInt(image.naturalWidth);
        imgheight = parseInt(image.naturalHeight);
        switch (true) {
            case (imgwidth <= 800):
                cofw = 1, cofh = 1;
                showwidth = cofw * imgwidth;
                showheight = cofw * imgheight;
                mindtext.innerText = "";
                break;
            case (imgwidth <= 1600):
                cofw = 0.5, cofh = 0.5;
                showwidth = cofw * imgwidth;
                showheight = cofh * imgheight;
                mindtext.innerText = "因图像幅面较大缩小显示！";
                break;
            case (imgwidth <= 3200):
                cofw = 0.25, cofh = 0.25;
                showwidth = cofw * imgwidth;
                showheight = cofh * imgheight;
                mindtext.innerText = "因图像幅面较大缩小显示！！";
                break;
            case (imgwidth <= 4000):
                cofw = 0.2, cofh = 0.2;
                showwidth = cofw * imgwidth;
                showheight = cofh * imgheight;
                mindtext.innerText = "因图像幅面较大缩小显示！";
                break;
            case (imgwidth > 4000):
                imgwidth = 800;
                let kk = 800 / image.naturalWidth;
                imgheight = parseInt(kk * image.naturalHeight);
                cofw = 1, cofh = 1;
                showwidth = cofw * imgwidth;
                showheight = cofw * imgheight;
                mindtext.innerText = "因图像幅面过大压缩为800x600处理！";
                break;
            default:
                cofw = 1, cofh = 1;
                showwidth = cofw * imgwidth;
                showheight = cofw * imgheight;
                mindtext.innerText = "";
                break;
        }
        canvas.setAttribute('width', imgwidth);
        canvas.setAttribute('height', imgheight);
        canvas.style.setProperty('width', showwidth + 'px');
        canvas.style.setProperty('height', showheight + 'px');
        //console.log(canvas.style);
    } else {
        mindtext.innerText = "无法读取图像，确认是否格式正确！";
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, imgwidth, imgheight);
}

function imgDataBuffer(imgBufArray, imgData, n = 5) {
    let imgBuf = imgData.dataClone();
    if (imgBufArray.length > n) {
        imgBufArray.shift();
        imgBufArray.push(imgBuf);
    } else {
        imgBufArray.push(imgBuf);
    }
    return imgBufArray.length;
}

function thresholdIterationGrayScale(grayarray, length) {
    let grayall = 0,
        k = 0,
        delta = 255;
    for (let i = 0; i <= 255; i++) {
        grayall += i * grayarray[i];
    }
    let tt = parseInt(4 * grayall / length);
    while (delta != 0) {
        let graylow = 0,
            numlow = 0,
            grayup = 0,
            numup = 0;
        for (let j = 0; j <= tt; j++) {
            graylow += j * grayarray[j];
            numlow += grayarray[j];
        }
        for (let j = tt; j <= 255; j++) {
            grayup += j * grayarray[j];
            numup += grayarray[j];
        }
        let tt2 = parseInt(((graylow / numlow) + (grayup / numup)) / 2);
        //console.log(tt+"*"+tt2);
        delta = Math.abs(tt2 - tt);
        tt = tt2;
        k += 1;
    }
    //console.log(tt+"*"+k+"*"+delta);
    return tt;
}

function thresholdOtsuGrayScale(grayarray) {
    let maxvariance = 0;
    for (let i = 0; i <= 255; i++) {
        let threshold = i;
        let graylow = 0,
            numlow = 0,
            grayup = 0,
            numup = 0;
        for (let j = 0; j <= threshold; j++) {
            graylow += j * grayarray[j];
            numlow += grayarray[j];
        }
        for (let j = threshold; j <= 255; j++) {
            grayup += j * grayarray[j];
            numup += grayarray[j];
        }
        let variance = numlow * numup * (graylow - grayup) * (graylow - grayup);
        //console.log(variance+"*"+maxvariance);
        if (variance >= maxvariance) {
            maxvariance = variance;
            tt = threshold;
        }
    }
    return tt;
}

function imgColorHistogram(canv, ctx, imgd) {
    //ctx.fillStyle="#eeeeee";
    ctx.clearRect(0, 0, canv.width, canv.height);
    if (imgd != null) {
        let pos, tmp, ymax = imgd.data.length / 10000;
        let grayarray = [256],
            redarray = [256],
            greenarray = [256],
            bluearray = [256];
        for (let i = 0; i <= 255; i++) {
            grayarray[i] = 0;
            redarray[i] = 0;
            greenarray[i] = 0;
            bluearray[i] = 0;
        }
        for (let x = 0; x < imgd.width; x++) {
            for (let y = 0; y < imgd.height; y++) {
                pos = (imgd.width * 4 * y) + (x * 4);
                tmp = imgd.data[pos];
                redarray[tmp] += 1;
                tmp = imgd.data[pos + 1];
                greenarray[tmp] += 1;
                tmp = imgd.data[pos + 2];
                bluearray[tmp] += 1;
                tmp = parseInt(imgd.data[pos] * 0.299 + imgd.data[pos + 1] * 0.587 + imgd.data[pos + 2] * 0.114);
                grayarray[tmp] += 1;
            }
        }
        let graymax = Math.max.apply(null, grayarray);
        ctx.strokeStyle = "#666666";
        ctx.beginPath();
        //console.log(graymax);
        for (let i = 0; i < 255; i++) {
            if (!isNaN(grayarray[i])) {
                ctx.moveTo(i / 2, 128);
                ctx.lineTo(i / 2, 128 - 120 * grayarray[i] / graymax);
            }
        }
        ctx.stroke();
        let redmax = Math.max.apply(null, redarray);
        ctx.strokeStyle = "#660000";
        ctx.beginPath();
        //console.log(redmax);
        for (let i = 0; i < 255; i++) {
            if (!isNaN(redarray[i])) {
                ctx.moveTo(135 + i / 2, 128);
                ctx.lineTo(135 + i / 2, 128 - 120 * redarray[i] / redmax);
            }
        }
        ctx.stroke();
        let greenmax = Math.max.apply(null, greenarray);
        ctx.strokeStyle = "#006600";
        ctx.beginPath();
        //console.log(greenmax);
        for (let i = 0; i < 255; i++) {
            if (!isNaN(greenarray[i])) {
                ctx.moveTo(i / 2, 256);
                ctx.lineTo(i / 2, 256 - 120 * greenarray[i] / greenmax);
            }
        }
        ctx.stroke();
        let bluemax = Math.max.apply(null, bluearray);
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        //console.log(bluemax);
        for (let i = 0; i < 255; i++) {
            if (!isNaN(bluearray[i])) {
                ctx.moveTo(135 + i / 2, 256);
                ctx.lineTo(135 + i / 2, 256 - 120 * bluearray[i] / bluemax);
            }
        }
        ctx.stroke();
        //graymax=0;redmax=0;greenmax=0;bluemax=0;
    }
}

function colorImgGrayHistogram(canv, ctx, imgd) {
    ctx.clearRect(0, 0, canv.width, canv.height);
    //console.log(imgd);
    if (imgd != null) {
        let pos, tmp, ymax = imgd.data.length / 10000;
        let grayarray = [256];
        for (let i = 0; i <= 255; i++) {
            grayarray[i] = 0;
        }
        for (let x = 0; x < imgd.width; x++) {
            for (let y = 0; y < imgd.height; y++) {
                pos = (imgd.width * 4 * y) + (x * 4);
                tmp = parseInt(imgd.data[pos] * 0.299 + imgd.data[pos + 1] * 0.587 + imgd.data[pos + 2] * 0.114);
                grayarray[tmp] += 1;
            }
        }
        let graymax = Math.max.apply(null, grayarray);
        ctx.strokeStyle = "#666666";
        ctx.beginPath();
        //console.log(graymax);
        for (let i = 0; i < 255; i++) {
            if (!isNaN(grayarray[i])) {
                ctx.moveTo(i, 256);
                ctx.lineTo(i, 256 - 240 * grayarray[i] / graymax);
            }
        }
        ctx.stroke();
    }
}

function grayImgGrayHistogram(canv, ctx, imgd) {
    ctx.clearRect(0, 0, canv.width, canv.height);
    //console.log(imgd);
    if (imgd != null) {
        let pos, tmp, ymax = imgd.data.length / 10000;
        let grayarray = [256];
        for (let i = 0; i <= 255; i++) {
            grayarray[i] = 0;
        }
        for (let x = 0; x < imgd.width; x++) {
            for (let y = 0; y < imgd.height; y++) {
                pos = (imgd.width * 4 * y) + (x * 4);
                tmp = imgd.data[pos];
                grayarray[tmp] += 1;
            }
        }
        let graymax = Math.max.apply(null, grayarray);
        ctx.strokeStyle = "#666666";
        ctx.beginPath();
        //console.log(graymax);
        for (let i = 0; i < 255; i++) {
            if (!isNaN(grayarray[i])) {
                ctx.moveTo(i, 256);
                ctx.lineTo(i, 256 - 240 * grayarray[i] / graymax);
            }
        }
        ctx.stroke();
    }
}

function grayArrayHistogram(canv, ctx, grayarray) {
    ctx.clearRect(0, 0, canv.width, canv.height);
    //console.log(imgd);
    if (grayarray != null) {
        let graymax = Math.max.apply(null, grayarray);
        ctx.strokeStyle = "#666666";
        ctx.beginPath();
        //console.log(graymax);
        for (let i = 0; i < 255; i++) {
            if (!isNaN(grayarray[i])) {
                ctx.moveTo(i, 256);
                ctx.lineTo(i, 256 - 240 * grayarray[i] / graymax);
            }
        }
        ctx.stroke();
    }
}

function histoBalanceGrayArray(grayarray, length) {
    let accum = [256],
        tmpaccum = 0;
    if (grayarray != null) {
        for (let i = 0; i < 256; i++) {
            tmpaccum += 4 * grayarray[i] / length;
            accum[i] = parseInt(255 * tmpaccum + 0.5);
            //console.log(accum[i]);
        }
    }
    return accum;
}

function btnpreview() {
    if (imgBuf.length <= 1) preview.disabled = true;
    let imgData = imgBuf.pop();
    context.putImageData(imgData.img, 0, 0);
}

function hsi2rgb(h, s, i) {
    let r, g, b;
    let th0 = Math.PI * 60 / 180;
    let th1 = Math.PI * 120 / 180;
    let th2 = Math.PI;
    let th3 = Math.PI * 240 / 180;
    let th4 = Math.PI * 300 / 180;
    let th5 = 2 * Math.PI;
    if (h >= 0 && h < th1) {
        b = i * (1 - s);
        r = i * (1 + s * Math.cos(h) / Math.cos(th0 - h));
        g = 3 * i - (b + r);
    }
    if (h >= th1 && h < th3) {
        r = i * (1 - s);
        g = i * (1 + s * Math.cos(h - th1) / Math.cos(th2 - h));
        b = 3 * i - (g + r);
    }
    if (h >= th3 && h <= th5) {
        g = i * (1 - s);
        b = i * (1 + s * Math.cos(h - th3) / Math.cos(th4 - h));
        r = 3 * i - (g + b);
    }
    return { r: 255 * r, g: 255 * g, b: 255 * b };
}
/*
function hsi2rgb(h,s,i){
	let r,g,b;
	let th1=Math.PI*2/3;
	let th2=2*th1;
	let th3=2*Math.PI;
	let angle1=60*Math.PI/180;
	let angle2=120*Math.PI/180;
	let angle3=240*Math.PI/180;
	let angle4=300*Math.PI/180;
	if(h>=0&&h<th1) {
		b=i*(1-s);
		r=i*(1+s*Math.cos(h)/Math.cos(angle1-h));
		g=3*i-(b+r);
	}
	if(h>=th1&&h<th2) {
		r=i*(1-s);
		g=i*(1+s*Math.cos(h-angle2)/Math.cos(Math.PI-h));
		b=3*i-(g+r);
	}
	if(h>=th2&&h<=th3) {
		g=i*(1-s);
		b=i*(1+s*Math.cos(h-angle3)/Math.cos(angle4-h));
		r=3*i-(g+b);
	}
	return {r:255*r,g:255*g,b:255*b};
}*/
/*
function rgb2hsi(r,g,b){
	let h,s,i,theta;
	ii=(r+g+b)/3;
	s=1-3*Math.min(r,g,b)/(r+g+b);
	if(r==g&&g==b||r==g&&r==b){
		h=Math.acos(0);
	}else{
		h=Math.acos(0.5*((r-b)+(r-g))/Math.sqrt((r-g)*(r-g)+(r-b)*(g-b)));
	}
	if(b>g) h=2*Math.PI-h;
	//console.log(h);
	//console.log(h+"**"+s+"**"+ii);
	return {h:h,s:s,i:ii/255};
}*/
function rgb2hsi(r, g, b) {
    let rr, gg, bb, h, s, i, theta;
    rr = r / 255;
    gg = g / 255;
    bb = b / 255;
    i = (rr + gg + bb) / 3;
    s = 1 - 3 * Math.min(rr, gg, bb) / (rr + gg + bb);
    if (r == g && g == b || r == g && r == b) {
        h = Math.acos(0);
    } else {
        h = Math.acos(0.5 * ((rr - bb) + (rr - gg)) / Math.sqrt((rr - gg) * (rr - gg) + (rr - bb) * (gg - bb)));
    }
    if (b > g) h = 2 * Math.PI - h;
    return { h: h, s: s, i: i };
}

function rgb2lab(r, g, b) {
    let xx, yy, zz, l, a, lb;
    r = gamma(r / 255);
    g = gamma(g / 255);
    b = gamma(b / 255);
    xx = 0.412453 * r + 0.357580 * g + 0.180423 * b;
    yy = 0.212671 * r + 0.715160 * g + 0.072169 * b;
    zz = 0.019334 * r + 0.119193 * g + 0.950227 * b;
    l = 116 * funt(yy / 1) - 16;
    a = 500 * (funt(xx / 0.950456) - funt(yy / 1));
    lb = 200 * (funt(yy / 1) - funt(zz / 1.088754));
    //console.log(h+"**"+s+"**"+ii);
    return { l: l, a: a, b: lb };
}

function lab2rgb(l, a, lb) {
    let xx, yy, zz, r, g, b;
    yy = 1 * funtint((l + 16) / 116);
    xx = 0.950456 * funtint((l + 16) / 116 + a / 500);
    zz = 1.088754 * funtint((l + 16) / 116 - lb / 200);
    r = 3.240479 * xx - 1.537150 * yy - 0.498535 * zz;
    g = -0.969256 * xx + 1.875992 * yy + 0.041556 * zz;
    b = 0.055648 * xx - 0.204043 * yy + 1.057311 * zz;
    return { r: 255 * r, g: 255 * g, b: 255 * b };
}

function funt(k) {
    let kk, t = (6 / 29) * (6 / 29) * (6 / 29);
    if (k > t) {
        kk = Math.cbrt(k);
    } else {
        kk = (29 / 6) * (29 / 6) * k / 3 + 4 / 29;
    }
    return kk;
}

function funtint(k) {
    let kk, t = (6 / 29);
    if (k > t) {
        kk = k * k * k;
    } else {
        kk = 3 * (6 / 29) * (6 / 29) * (k - 4 / 29);
    }
    return kk;
}

function gamma(k) {
    let kk;
    /*if(k>0.04045){
    	kk=Math.pow(10,2.4*Math.log((k+0.055)/1.066)/Math.LN10);
    }else{
    	kk=k/12.92;
    }*/
    kk = k;
    return kk;
}

function rgb2cmyk(r, g, b) {
    let c, m, y, k;
    c = 255 - r;
    m = 255 - g;
    y = 255 - b;
    k = Math.min(c, m, y);
    c = c - k;
    m = m - k;
    y = y - k;
    //console.log(h+"**"+s+"**"+ii);
    return { c: c, m: m, y: y, k: k };
}

function cmyk2rgb(c, m, y, k) {
    let r, g, b;
    if (c + k < 255) {
        r = 255 - (c + k);
    } else {
        r = 0;
    }
    if (m + k < 255) {
        g = 255 - (m + k);
    } else {
        g = 0;
    }
    if (y + k < 255) {
        b = 255 - (y + k);
    } else {
        b = 0;
    }
    return { r: r, g: g, b: b };
}

function rgb2yuv(r, g, b) {
    let y, u, v;
    y = 0.299 * r + 0.587 * g + 0.114 * b;
    v = 0.500 * r - 0.419 * g - 0.081 * b + 128;
    u = -0.169 * r - 0.331 * g + 0.500 * b + 128;
    return { y: y, u: u, v: v };
}

function yuv2rgb(y, u, v) {
    let r, g, b;
    r = y + 1.403 * (v - 128);
    g = y - 0.343 * (u - 128) - 0.714 * (v - 128);
    b = y + 1.770 * (u - 128);
    return { r: r, g: g, b: b };
}

function rgb2yuvbasic(r, g, b) {
    let y, u, v;
    y = 0.257 * r + 0.504 * g + 0.098 * b + 16;
    v = -0.148 * r - 0.209 * g + 0.439 * b + 128;
    u = 0.439 * r - 0.368 * g - 0.071 * b + 128;
    return { y: y, u: u, v: v };
}

function yuv2rgbbasic(y, u, v) {
    let r, g, b;
    r = 1.164 * (y - 16) + 2.018 * (u - 128);
    g = 1.164 * (y - 16) - 0.813 * (v - 128) - 0.391 * (u - 128);
    b = 1.164 * (y - 16) + 1.596 * (v - 128);
    return { r: r, g: g, b: b };
}

function rgb2yuvbk(r, g, b) {
    let y, u, v;
    y = 0.299 * r + 0.587 * g + 0.114 * b;
    u = -0.147 * r - 0.289 * g + 0.436 * b;
    v = 0.615 * r - 0.515 * g - 0.1 * b;
    //console.log(h+"**"+s+"**"+ii);
    return { y: y, u: u, v: v };
}

function yuv2rgbbk(y, u, v) {
    let r, g, b;
    r = y - 1.14 * v;
    g = y - 0.394 * u - 0.581 * v;
    b = y + 2.03 * u;
    return { r: r, g: g, b: b };
}

function rgb2yuv601(r, g, b) {
    let y, u, v;
    y = 0.257 * r + 0.504 * g + 0.098 * b + 16;
    u = -0.148 * r - 0.291 * g + 0.439 * b + 128;
    v = 0.439 * r - 0.368 * g - 0.071 * b + 128;
    //console.log(h+"**"+s+"**"+ii);
    return { y: y, u: u, v: v };
}

function yuv2rgb601(y, u, v) {
    let r, g, b;
    r = 1.164 * (y - 16) + 1.596 * (v - 128);
    g = 1.164 * (y - 16) - 0.812 * (v - 128) - 0.392 * (u - 128);
    b = 1.164 * (y - 16) + 2.016 * (u - 128);
    return { r: r, g: g, b: b };
}

function rgb2yuv709(r, g, b) {
    let y, u, v;
    y = 0.183 * r + 0.614 * g + 0.062 * b + 16;
    u = -0.101 * r - 0.339 * g + 0.439 * b + 128;
    v = 0.439 * r - 0.399 * g - 0.040 * b + 128;
    //console.log(h+"**"+s+"**"+ii);
    return { y: y, u: u, v: v };
}

function yuv2rgb709(y, u, v) {
    let r, g, b;
    r = 1.164 * (y - 16) + 1.792 * (v - 128);
    g = 1.164 * (y - 16) - 0.534 * (v - 128) - 0.213 * (u - 128);
    b = 1.164 * (y - 16) + 2.114 * (u - 128);
    return { r: r, g: g, b: b };
}