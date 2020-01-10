import JSZip from 'jszip'
import FileSaver from 'file-saver'

function b64toBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}

function getBase64Image (img) {
    var canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)
    var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
    ext = ext.slice(0, ext.indexOf('?'))
    var dataURL = canvas.toDataURL('image/' + ext)
    return {
        dataURL,
        type: ext
    }
}

export function handleBatchDownload (selectImgList, zipName) {
    const data = selectImgList
    const zip = new JSZip()
    let promisesNum = 0
    data.forEach(item => {
        const img = new Image()
        img.setAttribute('crossOrigin', 'anonymous')
        img.src = item.url + '?timeStamp=' + new Date()
        img.onload = () => {
            var base64Data = getBase64Image(img)
            var name = item.name + '.' + base64Data.type
            zip.file(name, b64toBlob(base64Data.dataURL), { base64: true })
            promisesNum++
            if (promisesNum === selectImgList.length) {
                saveFile()
            }
        }
    })
    function saveFile () {
        zip.generateAsync({
            type: 'blob'
        }).then(content => { // 生成二进制流
            FileSaver.saveAs(content, zipName) // 利用file-saver保存文件
        })
    }
}

export function singleImgByName (data) {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = data.url+"?timeStamp="+new Date();
    img.onload = () => {
        var base64Data = getBase64Image(img);
        var name = data.name + '.' + base64Data.type;
        FileSaver.saveAs(b64toBlob(base64Data.dataURL), name)
    }
}

