<html>
<header>
    <script type="text/javascript" src="zepto.min.js"></script>
    <script type="text/javascript" src="android.js"></script>
    <script type="text/javascript" src="binaryajax.js"></script>
    <script type="text/javascript" src="exif.js"></script>
    <script src="ios.js"></script>
    <script type="text/javascript" src="compress-upload.js"></script>
    <script>

        $(function(){
            $('#up').click(function(){
                var file=document.getElementById('img_file');
                var callback = function(response) {
                    console.log("image uploaded successfully! :)");
                    console.log(response);
                    var parsedJson = $.parseJSON(response);
                    alert(parsedJson.image.id);
                    var src='http://demo.com/display/'+parsedJson.image.id+'/160x120.jpg';
                    var i=document.getElementById('img_big');
                    i.src=src;
                }
                var result =compressUpload(file,'http://demo.com/upload',640,callback);
            });
        });
    </script>
</header>

<body>
<img id='ori_img'alt="default" />
<img id="compressed_img" alt="compressed_img"/>
<img id='img_big'alt="default"/>

<canvas id="myCvs"></canvas>
<canvas id="myCvs2"></canvas>
<form method="post">
    <input type="file" id="img_file" name="img"> <input type="button" id="up" value="show">
    <div id="result">result</div>
</form>
</body>
</html>


