const canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    //preview=document.getElementById('preview'),
    exifbtn = document.getElementById('exif'),
    mindtext = document.getElementById('mind'),
    outimg = document.getElementById("outimg"),
    outtext_1 = document.getElementById('outtext_1'),
    outtext_2 = document.getElementById('outtext_2'),
    loginfo = document.getElementById('log');
let imgwidth = 0,
    imgheight = 0,
    cofw = 1,
    cofh = 1,
    showwidth = 0,
    showheight = 0;
let img = new Image(),
    imgBuf;
img.src = "https://imgchr.com/i/NCzcYq";
img.addEventListener("load", loadimagemouse, false);
context.drawImage(img, 0, 0);
//preview.style.setProperty('display', 'none');
exifbtn.disabled = true;
loginfo.innerText = '';
let filein = document.getElementById('myfile');
filein.addEventListener("change", function() {
    file = filein.files[0];
    img.src = window.URL.createObjectURL(file);
    img.addEventListener("load", loadimagemouse, false);
    exifbtn.disabled = false;

});

function loadimagemouse(e) {
    loadimage(e);
    imgBuf = Array();
    //console.log(outtext_1);
    //preview.disabled=true;
    outtext_1.innerText = "";
    outtext_2.innerText = "";
    loginfo.innerText = '';
    canvas.onmouseup = canvasMouseup;
}

function canvasMouseup(ev) {
    if (ev.offsetX > 0 && ev.offsetX < canvas.width && ev.offsetY > 0 && ev.offsetY < canvas.height) {
        let info = context.getImageData(0, 0, canvas.width, canvas.height);
        //console.log(info);
        let pixel = context.getImageData(ev.offsetX / cofw, ev.offsetY / cofh, 1, 1);
        //console.log(pixel.data[0]);
        let str1 = "(" + pixel.data[0] + "," + pixel.data[1] + "," + pixel.data[2] + ")";
        let rr = pixel.data[0].toString(16).toUpperCase();
        if (rr.length < 2) rr = "0" + rr;
        let gg = pixel.data[1].toString(16).toUpperCase();
        if (gg.length < 2) gg = "0" + gg;
        let bb = pixel.data[2].toString(16).toUpperCase();
        if (bb.length < 2) bb = "0" + bb;
        let str2 = "#" + rr + gg + bb;
        outtext_1.innerText = str1;
        outtext_2.innerText = str2;

    }
}

function getexifinfo() {
    EXIF.getData(filein.files[0], function() {
        var camera = EXIF.getTag(this, "Make");
        var model = EXIF.getTag(this, "Model");
        var datetime = EXIF.getTag(this, "DateTimeDigitized");
        var expotime = EXIF.getTag(this, "ExposureTime");
        var iris = EXIF.getTag(this, "FNumber");
        var prog = EXIF.getTag(this, "ExposureProgram");
        var iso = EXIF.getTag(this, "ISOSpeedRatings");
        var bias = EXIF.getTag(this, "ExposureBias");
        var focuslength = EXIF.getTag(this, "FocalLength");
        var focuslocal = EXIF.getTag(this, "FocalLengthIn35mmFilm");
        var whitebalance = EXIF.getTag(this, "WhiteBalance");
        var metermode = EXIF.getTag(this, "MeteringMode");
        var exposuremode = EXIF.getTag(this, "ExposureMode");
        var digitalzoom = EXIF.getTag(this, "DigitalZoomRation");
        var source = EXIF.getTag(this, "FileSource");
        var id = EXIF.getTag(this, "ImageUniqueID");
        var version = EXIF.getTag(this, "ExifVersion");
        var gpsversion = EXIF.getTag(this, "GPSVersionID");
        var gpslaref = EXIF.getTag(this, "GPSLatitudeRef");
        var gpslatitude = EXIF.getTag(this, "GPSLatitude");
        var gpsloref = EXIF.getTag(this, "GPSLongitudeRef");
        var gpslongitude = EXIF.getTag(this, "GPSLongitude");
        var gpsatref = EXIF.getTag(this, "GPSAltitudeRef");
        var gpsaltitude = EXIF.getTag(this, "GPSAltitude");
        var gpsdate = EXIF.getTag(this, "GPSDateStamp");
        str = '器材：' + camera + ' ' + model + '<br/>' + '拍摄时间：' + datetime + '<br/>';
        str += '光圈：' + iris + '<br/>' + '曝光时间：' + expotime + '<br/>' + '快门：' + prog + '<br/>';
        str += '焦距：' + focuslength + '<br/>' + '等效焦距：' + focuslocal + '<br/>' + 'ISO：' + iso + '<br/>';
        str += '曝光补偿：' + bias + '<br/>' + '白平衡：' + whitebalance + '<br/>' + '数码变焦：' + digitalzoom + '<br/>';
        str += '测光模式：' + metermode + '<br/>' + '曝光模式：' + exposuremode + '<br/>' + '数据源：' + source + '<br/>';
        str += 'EXIF版本：' + version + '<br/>' + 'ID：' + id + '<br/>';
        if (typeof gpsversion !== "undefined") {
            str += 'GPS经度：' + gpslongitude + '  ' + 'GPS经度参考：' + gpsloref + '<br/>';
            str += 'GPS纬度：' + gpslatitude + '  ' + 'GPS纬度参考：' + gpslaref + '<br/>';
            str += 'GPS高度：' + gpsaltitude + '  ' + 'GPS高度参考：' + gpsatref + '<br/>';
        }
        //console.log(gpsversion);
        loginfo.innerHTML = str;
        var allinfo = EXIF.pretty(this);
        console.log(allinfo);
    });
}