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

## 内容目录 TODO

其实这个目录并没有什么固定的名字，主要包含的是书籍内容。

~~一般来说这个文件夹名字是OEPBS，但 OCF 推荐叫做该书的名字~~

目录内存有 opf 、ncx、css、html等文件...

重要的文件有 OPF 和 NCX

> 剩下的等下次放假
> QAQ