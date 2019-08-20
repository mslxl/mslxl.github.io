---
title: Epub 文件结构
tags:
  - Epub
keyword:
    - epub文件
    - epub结构
    - toc.ncx
    - content.opf

date: 2019-8-20
abbrlink: 29c50ab
---

epub 文件的实质其实是一个固定格式的 zip 压缩包，文件名以 UTF-8 编码，但是不同的软件对于同一个 epub 标准有不同的实现。

为了兼容所有软件，同时提升加载速度，最好是 Compression level = Store，因为个别软件严格遵守epub标准（比如 Okular）。

**OCF 规定: ZIP 文件的压缩等级必须为 stored 、方式为 deflate**
<details>
<summary>原文</summary>

<blockquote><p>OCF ZIP Containers MUST include only stored (uncompressed) and Deflate-compressed ZIP entries within the ZIP archive. OCF Processors MUST treat any OCF Containers that use compression techniques other than Deflate as being in error.</p></blockquote>

</details>

epub 主要由三部分组成 
* mimetype
* META-INF
* OEBPS
注意大小写敏感，这主要是针对 linux 平台上的诸多软件。

## mimetype

mimetype 主要是标记文件的格式，内容恒定，为
```mime
application/epub+zip
```


** OCF 规定： mimetype 内容必须为 `application/epub+zip` ，以 US-ASCII 编码，不得添加空格等任何字符，不得包含 Unicode 签名或 BOM 头。mimetype 文件不得被压缩、加密。文件名中不得有额外字符。**

<details>
<summary>原文</summary>
<div>
<blockquote>
<p>The first file in the OCF ZIP Container MUST be the mimetype file. The contents of this file MUST be the MIME media type [RFC2046] string application/epub+zip encoded in US-ASCII [US-ASCII].</p>
<p>The contents of the mimetype file MUST NOT contain any leading padding or white space, MUST NOT begin with the Unicode signature (or Byte Order Mark), and the case of the media type string MUST be exactly as presented above. The mimetype file additionally MUST NOT be compressed or encrypted, and there MUST NOT be an extra field in its ZIP header. </p>
</blockquote>

</div>
</details>

~~实践证明 mimetype 对epub的解析无影响，将内容改为 `application/epub+x-tar` 再压缩为 zip 依旧能正常打开，但如果压缩成 tar 解析错误。~~

~~该文件即使不存在都能正常打开，Edge 、 Okular 、Calibre 和 Neat Reader 都没有理这个文件~~

~~万一那个阅读器读取这个文件，最好还是写`application/epub+zip`吧~~

## META-INF 文件夹

### container.xml

内容一般无需更改
```xml
<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
   </rootfiles>
</container>
```
**经测试 `rootfiles` 下不管有几项 `rootfile` 项, Edge 只会读取第一项**

~~这不是和 OCF 对着干吗~~


<details>
<summary>测试内容</summary>
<ul>
<li>
我将文件修改为以下内容并添加 `OEBPS/content1.opf` 文件与 ncx 文件，两个ncx中章节名不同
```xml
<?xml version="1.0" encoding="UTF-8"?>
    <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
        <rootfiles>
            <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
            <rootfile full-path="OEBPS/content1.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>
```
重新压缩后打开后显示的章节名只有  `OEBPS/content.opf` 指向的 ncx 的章节名称，没有`OEBPS/content1.opf`中指向的 ncx 的章节名称
</li>
<li>
创建了一个新文件夹 `Test`
```xml
<?xml version="1.0" encoding="UTF-8"?>
    <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
        <rootfiles>
            <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
            <rootfile full-path="Test/content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>
```
结果和一相同
</li>
</ul>
</details>

### encryption.xml (可选)

**该文件可以不存在**

该文件储存有关加密的信息

例子：
```xml
<encryption
    xmlns ="urn:oasis:names:tc:opendocument:xmlns:container"
    xmlns:enc="http://www.w3.org/2001/04/xmlenc#"
    xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    <enc:EncryptedKey Id="EK">
        <enc:EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-1_5"/>
        <ds:KeyInfo>
            <ds:KeyName>John Smith</ds:KeyName>
        </ds:KeyInfo>
        <enc:CipherData>
            <enc:CipherValue>xyzabc</enc:CipherValue>
        </enc:CipherData>
    </enc:EncryptedKey>
    <enc:EncryptedData Id="ED1">
        <enc:EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#kw-aes128"/>
        <ds:KeyInfo>
            <ds:RetrievalMethod URI="#EK"
                Type="http://www.w3.org/2001/04/xmlenc#EncryptedKey"/>
        </ds:KeyInfo>
        <enc:CipherData>
            <enc:CipherReference URI="image.jpeg"/>
        </enc:CipherData>
    </enc:EncryptedData>
</encryption>
```

注意，以下为不可加密的文件：
* mimetype
* META-INF/container.xml
* META-INF/encryption.xml
* META-INF/manifest.xml
* META-INF/metadata.xml
* META-INF/rights.xml
* META-INF/signatures.xml


# TODO 待整理