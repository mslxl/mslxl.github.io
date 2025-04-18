---
title: 可靠 UDP 协议(RUDP协议)
date: 2024-01-21
categories:
  - 译
  - 计算机网络
description: 古早时期已过期的可靠 UDP 草案，也许还有些许价值
---

> 此草案已过期，未成为事实标准
>
> 原文地址: [draft-ietf-sigtran-reliable-udp-00](https://datatracker.ietf.org/doc/html/draft-ietf-sigtran-reliable-udp-00.txt)

## 1. 介绍

此互联网草案讨论了可靠UDP协议（RUDP）。RUDP是一个简单的基于数据包的传输协议。RUDP 基于 RFCs 1151 和 908 可靠数据协议。RUDP 位于UDP/IP 协议之上，为上层每个虚拟连接提供不超过最大重传次数的可靠的有序的数据传递。RUDP 具有灵活的设计，即它适用于多种传输用途，比如传输电信信号等

### 1.1 背景

跨 IP 网络的远程信号传输需要一种可靠的传输协议，这种传输协议的架构必须能够为多种应用在IP网提供传输服务

对现有的 IP 协议进行审查，可得出：需要一种新的可靠传输机制来用于电信信号协议。这种协议需要满足下列标准：

- 传输需要提供不超过最大重传次数的可靠传递服务（因此可避免旧消息滞留）
- 传输需要保证消息有序传递
- 传输基于消息报
- 传输提供流量控制
- 传输应该是低开销，高性能的
- 每个虚拟连接应该是可配置的（比如定时器）
- 传输应该提供保活机制
- 传输应当提供错误检测机制
- 应当保证安全传输

RUDP 旨在允许单独配置每个连接，以便可以在同一平台上同时实现具有不同传输要求的多种协议。

### 1.2 数据结构格式

#### 1. 用于数据传输的 6 个八位位组最小 RUDP 头部

每个由 RUDP 发送的 UDP 包的首部必须由 6 个八位位组的头部开始。第一个位组包含 8 个单独的 flags 位。接下来 3 个位组形成3个字段，每次字段占1个八位位组，分别是头长度(Header length)，序列号(Sequence number) 和确认号 (Acknowledgment number)。这三个字段后面是校验和，占2个位组。

```
    0 1 2 3 4 5 6 7 8            15
   +-+-+-+-+-+-+-+-+---------------+
   |S|A|E|R|N|C|T| |    Header     |
   |Y|C|A|S|U|H|C|0|    Length     |
   |N|K|K|T|L|K|S| |               |
   +-+-+-+-+-+-+-+-+---------------+
   |  Sequence #   +   Ack Number  |
   +---------------+---------------+
   |            Checksum           |
   +---------------+---------------+
        Figure 1, RUDP Header
```

##### 控制位(Control bits)

控制位指示数据包中存在的内容。 SYN 位表示存在同步段。 ACK 位表示头中的确认号有效。 EACK 位表示存在扩展确认段。 RST位表示数据包是一个复位段。 NUL 位指示数据包是空段。 TCS 位指示该数据包是传输连接状态段。SYN， EACK， RST 和 TCS 互斥。当 NUL 位置1时，ACK位同时置1。CHK 位指示校验和字段仅包含标头或同时包含标头的校验和和主体（数据）。如果 CHK 位为零，则校验和字段 仅包含标头的校验和。如果 CHK 位为 1，则校验和字段包含报头和数据的校验和。

##### 头长度(Header length)

头长度字段指示用户数据在数据包中的开始位置。 如果数据包的总长度大于标头的值，则数据包中存在用户数据。用户数据不能存在在设置了 EACK、NULL 或 RST 位的数据包中。包含用户数据的数据包中始终设置了 ACK 位，称为数据段。

##### 序列号(Sequence number)

每个包包含一个序列号。当连接初次建立时，每个对等体随机选择一个初始序列号。序列号在同步段中用于打开连接。每次传输数据，发送空段或者重置都会增加序列号。

##### 确认号(Acknowledgment Number)

确认号指示所接受到的最后一个有序分组的序列号

##### 检验和(Checksum)

为了确保数据的完整性，在 RUDP 的头部总是会计算校验和。此外，当 CHK 位被置为 1 时，检验和同时计算头和数据的内容。RUDP 的校验和算法应当采用和 UDP 或 TCP 相同的检验和算法，即每16位数据位的二进制反码相加然后再进行取反。

#### 2. 同步段(SYN Segment)

同步段用于建立连接，同时同步两个主机的序列号。同步段同时还包含两个连接的协商参数。对等方必须知道的所有可配置参数都包含在此段中。这包括本地 RUDP 愿意接受段的最大数量和正在建立的连接的选项的标志位。

```

    0             7 8            15
   +-+-+-+-+-+-+-+-+---------------+
   | |A| | | | | | |               |
   |1|C|0|0|0|0|0|0|       28      |
   | |K| | | | | | |               |
   +-+-+-+-+-+-+-+-+---------------+
   +  Sequence #   +   Ack Number  |
   +---------------+---------------+
   | Vers  | Spare | Max # of Out  |
   |       |       | standing Segs |
   +---------------+---------------+
   | Option Flags  |     Spare     |
   +---------------+---------------+
   |      Maximum Segment Size       |
   +---------------+---------------+
   | Retransmission Timeout Value  |
   +---------------+---------------+
   | Cumulative Ack Timeout Value  |
   +---------------+---------------+
   |   Null Segment Timeout Value  |
   +---------------+---------------+
   | Transfer State Timeout Value  |
   +---------------+---------------+
   |  Max Retrans  | Max Cum Ack   |
   +---------------+---------------+
   | Max Out of Seq| Max Auto Reset|
   +---------------+---------------+
   |    Connection Identifier      |
   +                               +
   |      (32 bits in length)      |
   +---------------+---------------+
   |           Checksum            |
   +---------------+---------------+

        Figure 2, SYN segment
```

##### 序列号(Sequence Number)

该字段包含了此连接选择的初始序列号

##### 确认号(Acknowledgement Number)

该字段当且仅当 ACK 标志位置 1 时才有效。在这种情况下，该字段将会包含接受到的 RUDP 的序列号

##### 版本号(Version)

使用的 RUDP 版本号。初始值为 1。

##### 最大未完成段数列(Maximum Number of Outstanding Segments)

未收到 ACK 时能发送的最大分片。 被接收端用作流控手段。连接建立时确定，在通信过程中不会改变。发送数据时，每端必须使用对端提供的值。

##### 选项标志字段(Options Flag Field)

这个两个八位位组的字段包含一组选项标志，指定此连接所需的一组可选功能。 标志的初步子集定义如下：

| Bit | #   | Bit Name | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| --- | --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0   |     | 未使用   | 未使用，必须设置为 1                                                                                                                                                                                                                                                                                                                                                                                               |
| 1   |     | CHK      | 启用数据校验和。如果该位被启用，那么校验和字段应该包含整个 RUDP 包的校验和（头和数据）。这是一个协商字段                                                                                                                                                                                                                                                                                                           |
| 2   |     | REUSE    | 该位必须在自动复位(auto reset)期间设置，以指示应使用先前的可协商参数。当该位设置时，SYN 的以下字段应由发送方设置为零，并且必须由接收方忽略：最大段大小(Maximun Segment Size)、重传超时值(Retransmission Timeout Value)、累积确认超时值(Cumulative Ack Timeout Value)、最大重传数(Max Retransmissions)、最大累积确认数(Max Cumulative Ack)、最大超时数顺序(Max Out of Sequence)和最大自动重置次数(Max Auto Reset)。 |
| 3-7 |     | Spare    | 留空备用                                                                                                                                                                                                                                                                                                                                                                                                           |

##### 最大段大小(Maximum Segment Size)

发送该 SYN 段消息的对等体可以接收的最大八位字节数。每一个对等体都可以指定一个不同的数值。每个对等体不可发送多于对方在连接协商时发送的这个域的值。这个数值应当也包含 RUDP 头的大小。这不是一个协商字段

##### 重传超时时间(Retransmission Timeout Value)

对于未确认的报文的超时重传时间。这个值以毫秒表示，有效值区间为 100 到 65536. 这是一个协商字段，对等双方必须在这个参数上达成一致。

##### 累积确认超时时间(Cumulative Ack Timeout Value)

如果没有收到其他确认段时，超时发送确认段的时间。该字段以毫秒表示，有效值为 100 到 65536。这是一个协商字段，对等双方必须在这个参数上达成一致。此外，这个值应当比[超时重传时间](#重传超时时间retransmission-timeout-value)小

##### 心跳时间(Null Segment Timeout Value)

如果没有收到其他数据段时，超时发送 null 段的时间。null 段作为保活机制发挥作用，目的在于心跳。这个值以毫秒表示，取值范围为 0 到 65536。0代表禁用 null 段。这是一个协商字段，对等双方必须在这个参数上达成一致。

##### 发送状态超时时间（Transfer State Timeout Value）

此超时值表示在自动重置发生之前为连接保存状态信息的时间量。这个值以毫秒表示，取值范围为 0 到 65536。这是一个协商字段，对等双方必须在这个参数上达成一致。取值为 0 则代表连接将会立刻自动重置。

##### 最大重传次数(Max Retrans)

在认为连接断开之前，最大尝试重传的次数。取值 0 到 255。0 表示永远尝试重传而不认为是连接断开。这是一个协商字段，对等双方必须在这个参数上达成一致。

##### 最大累计确认(Max Cum Ack)

如果未发送另一个段（指捎带确认）之前允许累积的最大确认数 。取值 0 到 255。如果取值为 0 则表示不进行累计确认，在收到数据段(data segment)，空段(null segment) 或者重置段(reset segment)时会立刻确认。这是一个协商字段，对等双方必须在这个参数上达成一致。

##### 最大失序数(Max Out of Seq)

在发送 EACK 之前最大允许的失序数据报的积累数量。取值 0 到 255. 取值为0表示在收到失序报文后立刻发送 EACK。这是一个协商字段，对等双方必须在这个参数上达成一致。

##### 最大自动复位（Max Auto Reset）

在连接被重置前，可执行连续自动复位的最大次数。取值 0 到 255. 0表示不会尝试自动复位。 这是一个协商字段，对等双方必须在这个参数上达成一致。当连接打开时，连续自动复位计数器应被清空。

##### 连接标识(Connection Identifier)

建立一个新的连接时，对等双方会通过当前RUDP连接传输一个唯一的连接 ID 给对方。双方均保存这个唯一ID。当自动复位发生时，对等双方应该发送原本保存的 ID 来指示当前连接正在发生自动复位。

#### 3. ACK 段

ACK 段用于确认有序段到达。它在RUDP头中包含接下来发送的序列号和确认序列号。ACK 段可以单独发送，也可以和数据组合进行捎带发送。Data 和 Null 段中必须设置 Ack 控制位(ACK bit)和确认号字段（Acknowledge Number field)。单独的确认段有 6 个八位位组。图 3 反应了一个单独的 ACK 段

```
    0 1 2 3 4 5 6 7 8            15
   +-+-+-+-+-+-+-+-+---------------+
   |0|1|0|0|0|0|0|0|       6       |
   +-+-+-+-+-+-+-+-+---------------+
   | Sequence #    |   Ack Number  |
   +---------------+---------------+
   |           Checksum            |
   +---------------+---------------+

    Figure 3, Stand-alone ACK segment
```

#### 4. EACK 段

EACK 段用于确认到达的失序段。它包含一个或多个接收到的失序序列号。 EACK 总是应该和 ACK 段进行组合，并给出未失序情况下应当接收到的序号。对于 EACK 段来说，头的长度是一个变量。它最小是 7，最大取决于于最大接收队列长度。图 4 反应了单独的 EACK 段

```
    0 1 2 3 4 5 6 7 8            15
   +-+-+-+-+-+-+-+-+---------------+
   |0|1|1|0|0|0|0|0|     N + 6     |
   +-+-+-+-+-+-+-+-+---------------+
   | Sequence #    |   Ack Number  |
   +---------------+---------------+
   |1st out of seq |2nd out of seq |
   |  ack number   |   ack number  |
   +---------------+---------------+
   |  . . .        |Nth out of seq |
   |               |   ack number  |
   +---------------+---------------+
   |            Checksum           |
   +---------------+---------------+

       Figure 4, EACK segment

```

#### 5. RST 段

RST 段用于关闭或重置连接。在受到RST 段后，发送方应当在将从 API 接受到的数据包发送后停止发送新的数据报，在此期间停止API停止接受新数据。RST 段应当被单独发送且不包含任何数据。

```
    0 1 2 3 4 5 6 7 8            15
   +-+-+-+-+-+-+-+-+---------------+
   | |A| | | | | | |               |
   |0|C|0|1|0|0|0|0|        6      |
   | |K| | | | | | |               |
   +-+-+-+-+-+-+-+-+---------------+
   | Sequence #    |   Ack Number  |
   +---------------+---------------+
   |         Header Checksum       |
   +---------------+---------------+

          Figure 5, RST segment
```

#### 6. NUL 段

NUL 段用于判断连接是否存活。因此 NUL 段作为保活机制发挥作用。当收到 NUL 段时，在连接合法的情况下RUDP 实现必须立刻发送确认，序列号为下一个应受到的序列号。NUL 段必须和 ACK 组合，但不和用户数据组合。

```
    0 1 2 3 4 5 6 7 8            15
   +-+-+-+-+-+-+-+-+---------------+
   |0|1|0|0|1|0|0|0|       6       |
   +-+-+-+-+-+-+-+-+---------------+
   | Sequence #    |  Ack Number   |
   +---------------+---------------+
   |            Checksum           |
   +---------------+---------------+

        Figure 6, NUL segment

```

#### 7. TCS 段

TCS 用于传输状态信息

```
    0 1 2 3 4 5 6 7 8            15
   +-+-+-+-+-+-+-+-+---------------+
   | |A| | | | | | |               |
   |0|C|0|0|0|0|1|0|       12      |
   | |K| | | | | | |               |
   +-+-+-+-+-+-+-+-+---------------+
   | Sequence #    |   Ack Number  |
   +---------------+---------------+
   | Seq Adj Factor|      Spare    |
   +---------------+---------------+
   |      Connection Identifier    |
   |       (32 bits in length)     |
   +---------------+---------------+
   |            Checksum           |
   +---------------+---------------+

          Figure 7, TCS segment
```

##### 序列号(Sequence Number)

序列号字段包含该连接选择的初始序列号

##### 确认号(Acknowledgement Number)

确认号指示收到的按序传输的最后一个数据包

##### 序列调整因子(Seq Adj Factor)

这个字段用于在旧连接和新连接之间在传输阶段调整序列号的状态

##### 连接标识(Connection Identifier)

建立一个新的连接时，对等双方会通过当前RUDP连接传输一个唯一的连接 ID 给对方。双方均保存这个唯一ID。当自动复位发生时，对等双方应该发送原本保存的 ID 来指示当前连接正在发生自动复位。

#### 1.2.1 详细设计

单独的一份使用 SDL 格式描述连接状态和传输的互联网草案还在准备中。

~~1999年就过期了，不会有了~~

#### 1.2.2 功能描述

##### 1. 重传定时器

发送端有重传定时器，超时时间可配。每次发送 data，null 或 reset 段并且当前没有一个片段被计时，都会初始化此计时器。

如果在定时器到期时未收到对此数据段的确认，则重发已发送但未确认的所有分片。如果仍有一个或多个已发送但未确认的数据包，则在收到定时段时重启重传定时器。 重传定时器的推荐值为600毫秒。

##### 2. 重传计数器

发送端维护一个重发次数的计数器，计数器最大值可配，建议为 2。如果计数器超过其最大值，则认为连接已断开。

##### 3. 独立 ACK 分片

独立 ACK 段是仅包含确认信息的段。 其 sequence number 字段包含要发送的下一个 data，null 或 reset 段的序列号。

##### 4. ACK 信息捎带

当接收端向发送端发送 data，null 或 reset 段时，接收端需要在报头的 ACK 中填上最后的一次从发送端收到的 data，null 或 reset 段的序列号。

##### 5. 累积 ACK 计数器

接收端维持接收到的未确认分片的计数器，计数器的最大值可配。 如果超过计数器的最大值，则接收端发送独立 ACK 或 EACK（如果存在无序分片）。 累积 ACK 计数器的建议值为3。

##### 6. 无序 ACK 计数器

接收端维护一个已经无序到达的分片的计数器。当计数器超过配置的最大值时，发送一个包含已经接收的所有当前无序段的序列号的 EACK 段到发送端，然后计数器重置为零。无序 ACK 计数器的建议值为3。

当发送端接收到 EACK 时，会将丢失的数据段重新发送给接收端。

##### 7. 累积 ACK 分片定时器

当接收端有未确认的分片或无序队列中有分片时，它会分别在发送独立确认或扩展确认之前等待最长时间。 当此定时器到期时，如果在无序队列中存在分片，则发送扩展确认。 否则，如果当前有未确认分片，则发送独立确认。 累积 ACK 定时器的建议值为 300 毫秒。

每当在数据，空或重置段中发送确认时，重新启动累积 ACK 定时器，前提是当前没有分片在无序列队列中。 如果序列外队列中存在分片，则不会重新启动定时器，以便在再次到期时再发送另一个扩展确认。

##### 8. NULL 段定时器

Client 维护一个定时器，连接打开时启动，每次发送数据段时重置。如果 Client 的 NULL 段定时器到期，则 Client 将 NULL 段发送到 Server。

如果 Server 的序列号有效，则由 Server 确认空段。 Server 维护一个空段定时器，其超时值是 Client 超时值的两倍。

只要从 Client 收到数据或空段，Server 的计时器就会重置。 如果 Server 的空段定时器到期，则认为连接已断开。空段定时器的值是 2 秒。

##### 9. 自动重置

连接的任何一方都可以自动重置。自动重置的原因可能是

- 重传计数超过其最大值
- 服务器的 NULL 段计时器到期
- 传输状态计时器到期

自动重置将使两端重置其当前状态，包括刷新重传和无序队列，然后重置其初始序列号并重新协商连接。每端将通知其上层协议（ULP）自动重置。

有一个连续的重置计数器，用于设置在没有连接打开的情况下可以发生的最大自动重置次数。 如果此计数器超过其最大值，则重置连接。连续重置计数器的建议值为 3。

##### 10. 接收端接收队列大小

接收端接收队列的大小是可配置参数。建议值为 32 个数据包。

接收队列大小充当流控制机制。

##### 11. 拥塞控制和慢启动

RUDP 未提供。

##### 12. UDP 端口号

RUDP 对使用哪个 UDP 端口号没有任何限制。
有效端口号是 RFC 1700 中未定义的端口。

##### 13. 支持冗余连接

如果 RUDP 连接失败，将发信号通知上层协议，并启动传输状态计时器。 ULP 可以通过 API 调用启动将此状态传输到另一个 RUDP 连接
RUDP 会将状态信息传输到新连接，以确保数据包不会重复或丢失。

如果 ULP 在传输状态计时器到期之前没有将状态转移到另一个连接，则连接状态将丢失，并且连接队列的缓冲区被释放。 传输状态定时器的超时值是可配置的。

传输状态计时器的建议值为 1 秒。

##### 14. 连接断开的处理

以下情况发生时，则认为 RUDP 连接断开：

- 重传定时器到期且重传计数已超过其最大值。
- NULL 段定时器过期。
  如果出现上述两种情况中的任何一种并且传输状态超时不为零，则通过 API 的连接失败信号通知ULP 连接失败，并且将启动传输状态定时器。 如果传输状态计时器到期，则执行自动复位，并通过 API 的连接自动复位信号通知 ULP。

如果传输状态超时值为零，则当上述两种情况中的任何一种发生时，将立即执行自动复位。 ULP 将通过 API 的连接自动重置信号通知连接失败。

##### 15. 重传算法

接收到 EACK 段或重传定时器超时而发生重传。

收到 EACK 段时，消息中指定的段将从未确认的已发送队列中删除。 要重传的段是通过检查 EACK 段中的 ack 号和最后一个 seq 号来确定的。 重新发送未确认的发送队列不包括这两个序列号之间的所有报文段。

当发生重传超时时，重传未确认的已发送队列上的所有消息。

##### 16. 上层协议通信信号

以下信号将通过 API 传输给上层协议，通知异步事件：

- Connection open：连接状态变为 Open 时发送信号。
- Connection refused：连接状态从 Close Wait 以外状态转为 Closed 时发送信号。
- Connection closed：连接状态从 Close Wait 转为 Closed 时发送信号。
- Connection failure：连接状态断开时发送信号。
- Connection auto reset：连接自动复位时发送信号。向上层协议通知数据可能丢失且 RUDP 正试图将连接返回到打开状态。

##### 17. 校验和算法

RUDP 中使用的校验和算法与 UDP 和 TCP 头中使用的算法相同，它是被检验数据的每16位求和的补码。CHK 置1时，对整个报文计算校验和。否则，只对头部计算校验和。

##### 18. FEC 前向纠错

RUDP没有定义前向纠错（FEC）的处理。它会丢弃收到的重复包。

##### 19. 安全性

RUDP 将兼容 IPsec 标准。

### 1.3. 参数协商

当客户端发起连接时，发送一个 SYN 段，包含上层通过 API 定义的协商参数。
服务器可以通过带有 ACK 响应的 SYN 接受这些参数，或者在其 SYN 中使用 ACK 响应提出不同的参数。
然后，客户端可以选择接受服务器发送的参数并发送 ACK 来建立连接，或者发送 RST 来拒绝连接。
在自动重置期间无法重新协商。
