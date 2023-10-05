---
title: Epub 文件结构
keyword:
    - epub文件
    - epub结构
    - toc.ncx
    - content.opf
date: 2019-09-20T20:00:00+08:00
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

`OEBPS/content.opf` 就是下文中要提到的 [opf 文件](#opf)

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

下面的一个例子展示了被 AES 加密的 `image.jpeg` ,使用 John Smith 的 RSA 密匙进一步加密。
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

### manifest.xml (可选)

该文件提供 epub 中的文件清单

OCF 并没有规定清单格式

### metadata.xml (可选)

该文件定义 epub 文件中的元数据

如果 `metadata.xml`存在，他的命名空间必须被显示的声明为 [[XMLNS]](https://www.w3.org/TR/2009/REC-xml-names-20091208/)。文件应当在命名空间 `http://www.idpf.org/2013/metadata` 仅包含一个根节点 `metadata`。其他的节点为了向后兼容允许存在，，阅读器应当无视 `metadata.xml` 中不能识别的根节点。

3.1版的 OCF 中并没有定义 `metadata.xml` 中元数据的用途。也许未来会有。

### rights.xml (可选)

该文件用于数字版权管理（DRM），用于在权利人，中间人和用户之间信任交换EPUB出版物的信息。
3.1 版的 OCF 标准中并未规定 DRM 细细的特殊格式，但未来也许有。`rights.xml` 的命名空间应当被显式的声明为  [[XMLNS]](https://www.w3.org/TR/2009/REC-xml-names-20091208/) 来避免以后的冲突。

当 rights.xml 不存在时，版权信息可能位于其他位置。

### signatures.xml (可选)

该文件存有 epub 的数组签名。它的内容必须符合 [signatures.xml](https://www.w3.org/Submission/epub-ocf/#app-schema-signatures)  schema.

`signatures.xml` 的根节点为 `signatures`，子节点为定义在 [XML DSIG Core](https://www.w3.org/Submission/epub-ocf/#refXMLDSIGCORE) 中的 `Signature`。签名可以部分应用，也可以应用到 epub 整体，它可以使任何形式的签名数据，也就是说，不仅仅是 XML。


下面的 XML 是 signatures.xml的一个例子，它包含了一个签名，应用到了两个资源，分别是 `EPUB/book.xhtml` 和 `EPUB/images/cover.jpeg`
```xml
<signatures xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <Signature Id="sig" xmlns="http://www.w3.org/2000/09/xmldsig#">
        <SignedInfo>
            <CanonicalizationMethod 
                Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
            <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#dsa-sha1"/>
            <Reference URI="#Manifest1">
                <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
                <DigestValue>j6lwx3rvEPO0vKtMup4NbeVu8nk=</DigestValue>
            </Reference>
        </SignedInfo>
        <SignatureValue>…</SignatureValue>
        <KeyInfo>
            <KeyValue>
                <DSAKeyValue>
                    <P>…</P><Q>…</Q><G>…</G><Y>…</Y> 
                </DSAKeyValue>
            </KeyValue>
        </KeyInfo>
        <Object>
            <Manifest Id="Manifest1">
                <Reference URI="EPUB/book.xhtml">                    
                    <Transforms>                                                
                        <Transform
                            Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>                        
                    </Transforms>
                    <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
                    <DigestValue></DigestValue>
                </Reference>
                <Reference URI="EPUB/images/cover.jpeg">
                    <Transforms>                                                
                        <Transform
                            Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>                        
                    </Transforms>
                    <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
                    <DigestValue></DigestValue>
                </Reference>
            </Manifest>
        </Object>
    </Signature> 
</signatures>
```

## 内容目录

其实这个目录并没有什么固定的名字，主要包含的是书籍内容。

~~一般来说这个文件夹名字是OEPBS，但 OCF 推荐叫做该书的名字~~

目录内存有 opf 、ncx、css、html等文件...

重要的文件有 OPF 和 NCX

### opf

以下为一个例子。
我认为只需要一个例子就能说明了。

```xml
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE package PUBLIC "+//ISBN 978-7-308-05831-5//DTD OEB 1.2 Package//EN" "http://openebook.org/dtds/oeb-1.2/oebpkg12.dtd">
<package unique-identifier="bookid" 
    xmlns:opf="http://www.idpf.org/2007/opf" 
    xmlns="http://www.idpf.org/2007/opf" version="2.0">
    <metadata>
        <dc-metadata xmlns:dc="http://purl.org/dc/elements/1.1/" 
            xmlns:dcterms="http://purl.org/dc/terms/" 
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <dc:title>龙族 I</dc:title>
            <dc:creator>江南老贼</dc:creator>
            <!-- dc:subject 主题或关键字 -->
            <dc:subject>幻想</dc:subject>
            <dc:subject>刀片</dc:subject>
            <dc:subject>胃药</dc:subject>
            <dc:subject>冒险</dc:subject>
            <!-- dc:description 简介 -->
            <dc:description>你年少的时候，是否有过孤独而热血的梦？2010，龙，改变世界秘史！<dc:description>
            <!-- dc:publisher 出版方 -->
            <dc:publisher>长江出版社</dc:publisher>
            <!-- dc:contributor 贡献者 -->
            <dc:contributor/>
            <dc:date>2013-07-01</dc:date>
            <dc:type>普通图书</dc:type>
            <dc:format>Text/html(.html,.htm)</dc:format>
            <dc:identifier id="bookid" opf:scheme="ISBN">isbn:9787549220632</dc:identifier>
            <!-- dc:source 来源 -->
            <dc:source/>
            <dc:language>chinese</dc:language>
            <dc:relation/>
            <dc:coverage/>
            <dc:rights>机械工业出版社版权所有</dc:rights>
        </dc-metadata>
    <x-metadata/>
    </metadata>
    <!--manifest 文件清单，列出OEBPS文档及相关的文件（图片），仅由一种子元素组成
        id 可以自由命名，在以后多个位置都有使用，较为重要 -->
    <manifest>
        <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
        <item id="style" href="style.css" media-type="text/css"/>
        <item id="cover" href="cover.htm" media-type="text/html"/>
        <item id="tableofc" href="toc.xhtml" media-type="application/xhtml+xml"/>
        <item id="forword" href="forword.xhtml" media-type="application/xhtml+xml"/>
        <item id="chap01" href="chap01.xhtml" media-type="application/xhtml+xml"/>
        <item id="chap02" href="chap02.xhtml" media-type="application/xhtml+xml"/>
        <item id="chap03" href="chap03.xhtml" media-type="application/xhtml+xml"/>
        <item id="chap04" href="chap04.xhtml" media-type="application/xhtml+xml"/>
        <item id="chap05" href="chap05.xhtml" media-type="application/xhtml+xml"/>
        <item id="chap06" href="chap06.xhtml" media-type="application/xhtml+xml"/>
        <item id="chap07" href="chap07.xhtml" media-type="application/xhtml+xml"/>
        <item id="chap08" href="chap08.xhtml" media-type="application/xhtml+xml"/>
        <item id="chap09" href="chap09.xhtml" media-type="application/xhtml+xml"/>
        <item id="chap10" href="chap10.xhtml" media-type="application/xhtml+xml"/>
        <item id="reference" href="reference.xhtml" media-type="application/xhtml+xml"/>
    </manifest>
    <!-- 提供书籍的线性阅读次序
        toc 填上面 manifest 中 ncx 文件的 ID，关于 ncx 文件下面提 -->
    <spine toc="ncx">
        <!-- idref 是上面 manifest 中 item 的 id -->
        <itemref idref="cover"/>
        <itemref idref="tableofc"/>
        <itemref idref="forword"/>
        <itemref idref="chap01"/>
        <itemref idref="chap02"/>
        <itemref idref="chap03"/>
        <itemref idref="chap04"/>
        <itemref idref="chap05"/>
        <itemref idref="chap06"/>
        <itemref idref="chap07"/>
        <itemref idref="chap08"/>
        <itemref idref="chap09"/>
        <itemref idref="chap10"/>
        <itemref idref="reference"/>
    </spine>
    <!-- guide 指南,依次列出电子书的特定页面, 例如封面、目录、序言等, 属性值指向文件保存地址。一般情况下，epub电子书不用该元素 -->
    <guide/>
    <!-- tour 导读。可以根据不同的读者水平或者阅读目的, 按一定次序, 选择电子书中的部分页面组成导读。一般情况下，epub电子书不用该元素。-->
    <tour/>
</package>
```
另：~~江南就是个写小说的，他懂个什么龙族~~

**千万千万不要写不存在的 path 或 idref， Edge 会哭给你看的哦**

### ncx

ncx文件用来描述电子书的目录结构，一般来说，opf 中 spine 一般也会出现在这里。

```xml
<?xml version='1.0' encoding='utf-8' ?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
    <head>
        <meta content="coay_307750" name="dtb:uid" />
        <meta content="2" name="dtb:depth" />
        <meta content="COAY.COM [http://www.coay.com]" name="dtb:generator" />
        <meta content="0" name="dtb:totalPageCount" />
        <meta content="0" name="dtb:maxPageNumber" />
    </head>
    <docTitle>
        <text>《龙族 I》</text>
    </docTitle>
    <docAuthor>
        <text>江南</text>
    </docAuthor>
    <navMap>
        <!-- class 划重点
            id 这里好像没什么用处
            playOrder 要和 opf 中 spine 的 item 顺序一致 -->
        <navPoint class="chapter" id="article_307750_1" playOrder="1">
            <navLabel>
                <text>第1章</text>
            </navLabel>
            <content src="article_307750_1.html" />
        </navPoint>
        <navPoint class="chapter" id="article_307750_2" playOrder="2">
            <navLabel>
                <text>第2章</text>
            </navLabel>
            <content src="article_307750_2.html" />
        </navPoint>
        <navPoint class="chapter" id="article_307750_3" playOrder="3">
            <navLabel>
                <text>第3章</text>
            </navLabel>
            <content src="article_307750_3.html" />
        </navPoint>
        <navPoint class="chapter" id="article_307750_4" playOrder="4">
            <navLabel>
                <text>第4章</text>
            </navLabel>
            <content src="article_307750_4.html" />
        </navPoint>
        <navPoint class="chapter" id="article_307750_5" playOrder="5">
            <navLabel>
                <text>第5章</text>
            </navLabel>
            <content src="article_307750_5.html" />
        </navPoint>
        <!-- 经 Okular 测试这里是可以分卷的
            不过标准中没写，可能会出现无法识别的情况（比如 Edge） -->
        <navPoint class="chapter" id="article_307750_5" playOrder="5">
            <navLabel>
                <text>第1卷</text>
            </navLabel>
            <navPoint class="chapter" id="article_307750_1" playOrder="1">
                <navLabel>
                    <text>第1章</text>
                </navLabel>
                <content src="article_307750_1.html" />
            </navPoint>
            <navPoint class="chapter" id="article_307750_2" playOrder="2">
                <navLabel>
                    <text>第2章</text>
                </navLabel>
                <content src="article_307750_2.html" />
            </navPoint>
        </navPoint>
    </navMap>
</ncx>
```

## html 坑点

以下内容一点也不能少，少了 Edge 会哭的。


```html
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-CN">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>第二章</title>
</head>
<body>
    <div>
        正文
    </div>
</body>
</html>

```
~~又是你 Edge~~
