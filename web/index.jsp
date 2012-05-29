<%-- 
    Document   : indexnnk
    Created on : 17-Dec-2011, 17:25:34
    Author     : Frugras
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <script src="jquery.js"></script>
        <script src="jquery.hotkeys.js"></script>
        <script src="pongmain.js"></script>
        <script src="sound.js"></script>
        <style>
            .box {
                border: 2px #000000 solid;
                margin: auto;
            }
            .boxs {
                border: 2px #000000 solid;
            }
            h1 {
                margin:auto;
                text-align: center;
                font-family: sans-serif;
            }
            #canvascont {
                margin: auto;
                width: 800px;
            }
        </style>
    </head>
    <body onload="main()">
        <h1>Pong!</h1>
        <div id="canvascont"></div>
    </body>
</html>
