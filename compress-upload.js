/**
 * Created by yuwei on 14-4-16.
 */
function rotate(canvasTarget, image, w, h,orientation){
        if(orientation==6 || orientation==8){
            canvasTarget.width = h;
            canvasTarget.height = w;
        }else{
            canvasTarget.width = w;
            canvasTarget.height = h;
        }
    var ctxtarget = canvasTarget.getContext("2d");
    if(orientation==6){
        ctxtarget.translate(h, 0);
        ctxtarget.rotate(Math.PI / 2);
    }else if(orientation==8){
        ctxtarget.translate(0,w);
        ctxtarget.rotate(270*Math.PI/180 );
    }else if(orientation==3){
        ctxtarget.translate(w,h);
        ctxtarget.rotate(Math.PI );
    }
    ctxtarget.drawImage(image, 0, 0);
}

function upload(i, upload_url, file_input_name, filename, callback) {

    //ADD sendAsBinary compatibilty to older browsers

    if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
        XMLHttpRequest.prototype.sendAsBinary = function(string) {
            var bytes = Array.prototype.map.call(string, function(c) {
                return c.charCodeAt(0) & 0xff;
            });
            this.send(new Uint8Array(bytes).buffer);
        };
    }
    var type = 'image/jpeg';
    var myEncoder = new JPEGEncoder();
    var JPEGImage = myEncoder.encode(i,100);
    var data=JPEGImage.substr(23);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    };
    xhr.open('POST', upload_url, true);
    var boundary = 'someboundary';
    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    xhr.sendAsBinary(['--' + boundary, 'Content-Disposition: form-data; name="' + file_input_name + '"; filename="' + filename + '"', 'Content-Type: ' + type, '', atob(data), '--' + boundary + '--'].join('\r\n'));
}

function compressUpload(file,url,size,callback){
    var f=file.files[0];
    var reader=new FileReader();
    //创建img保存file的值
    var s=document.createElement('img');
    reader.readAsDataURL(f);
    reader.onload = function(e){
        s.src=this.result;
    }
    s.onload = function(){
        //计算变换后的长宽值
        var width=0;
        var height=0;
        var MAX_SIZE=size;
        if(s.width <MAX_SIZE && s.height < MAX_SIZE){
            width=s.width;
            height=s.height;
        }
        else{
            if(s.width>s.height){
                width=MAX_SIZE;
                height=s.height*MAX_SIZE/s.width;
            }
            else{
                height=MAX_SIZE;
                width=s.width*MAX_SIZE/s.height;
            }
        }
        var base64='';
        var mpImg = new MegaPixImage(f);
        var img_test=document.createElement('img');
        mpImg.render(img_test, {maxWidth: width, maxHeight: height });
        var Orientation=1;
        EXIF.getData(f, function() {
            Orientation=EXIF.getTag(this,'Orientation');
            img_test.onload=function(){
                var  myCvs=document.createElement("canvas");
                var myctx=myCvs.getContext('2d');
                var ii='';
                if(Orientation==6 || Orientation==8){
                    rotate(myCvs,img_test,width,height,Orientation);
                     ii=myctx.getImageData(0,0,height,width);
                }else{
                    rotate(myCvs,img_test,width,height,Orientation);
                     ii=myctx.getImageData(0,0,width,height);
                }
                upload(ii, url , 'file', 'new.jpg', callback);
            }
        });
    }
}
;