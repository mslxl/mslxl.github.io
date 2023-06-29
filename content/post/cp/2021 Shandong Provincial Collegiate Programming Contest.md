---
title: "2021 Shandong Provincial Collegiate Programming Contest"
date: 2023-03-04T08:27:52+08:00
draft: false
tags:
  - Competitive Programming
  - ICPC
  - 题解
---

[比赛链接](https://codeforces.com/gym/103118)

## C - Cat virus

> 对于一颗树, 它的节点可以被染为黑色或者白色. 如果一个节点是白色,那么她的子节点可以是白色,也可以是黑色. 如果这个节点是黑色, 那么她的子节点一定是黑色. 现在输入一个数字 $2\le K \le 2\times 10^{18}$, 根据上述方式构造一棵数, 使之不同的染色方式有 $K$ 种

`思维` `构造`

~~刚开始做的时候没带脑子,直接构造了一个 $(1,2), (2,3) \ldots (n-1, n)$,结果狠狠的 TLE~~

反向思考,当 $x$ 为白色的时候,它的父节点一定也为白色,而当这个节点是黑色的时候,它的父节点可以是白色,也可以是黑色.

设节点 a 及其子树有 $n$ 中染色方式, 增加一节点 b 连接到 a, 有以下情况:

- 当 a 为黑色时, 所有节点都为黑色, 1 种染色方式
- 当 a 为白色, b 为黑色时, 有 $n-1$ 中染色方式
- 当 a 为白色, b 为白色时, 有 $n-1$ 中染色方式

即向一个 $n$ 种渲染方式的节点中添加一个节点, 会使其变为 $2n-1$ 种染色方式.

因此我们可以构造一个树,目的是使其有 $K$ 中染色方式,当其减少最后一次添加的节点时应该有 $\frac{K+1}{2}$ 种或者 $K-1$ 染色方式,因此只需要进行深度搜索,每次搜索时判断数字的奇偶性即可.

```cpp
// clang-format off
#include <bits/stdc++.h> 
using ll = long long; using ul = unsigned long long; using ld = long double;
template <typename T> inline typename std::enable_if<std::is_integral<T>::value>::type read(T &x){ char c;T f=1; while(!isdigit(c=getchar())) if(c=='-')f=-1; x=(c&15); while(isdigit(c=getchar())) x= (x<<1) + (x<<3) + (c&15); x*=f; } template <typename T, typename... A> inline void read(T &value, A &..._t) { read(value), read(_t...); }
void solve(const std::size_t testcase);
#define rep(NAME, MAX) for(decltype(MAX) NAME = 0; NAME < MAX; NAME++)
#define rep1(NAME, MAX) for(decltype(MAX) NAME = 1; NAME <= MAX; NAME++)
#define repv0(NAME, START) for(decltype(START) NAME = START; NAME >= 0; NAME--)
#define repv1(NAME, START) for(decltype(START) NAME = START; NAME >= 1; NAME--)
int main() {
  std::size_t t = 1;
  // read(t);
  // std::ios::sync_with_stdio(false); std::cin.tie(nullptr); std::cout.tie(nullptr);
  rep1(i, t) solve(t);
  return 0;
}
// clang-format on

std::set<std::pair<int,int>> links;

int top = 1;
void dfs(int x, int cnt){
  if(cnt == 2) return;
  cnt--;
  if(cnt % 2 == 1 || cnt == 2){
    links.insert(std::make_pair(x, ++top));
    dfs(top, cnt);
  }else{
    links.insert(std::make_pair(x, ++top));
    links.insert(std::make_pair(x, ++top));
    dfs(top, cnt * 2);
  }
}

int k;
void solve(const std::size_t testcase) {
  std::cin >> k;

  std::cout << links.size() + 1 << "\n";
  for(auto &item: links){
    std::cout << item.first << " " << item.second << "\n";
  }
}

```

## D - Dyson Box

> 在一个二维的格子中,每轮在指定位置放入一个方块, 方块会在向左的重力和向下的重力下移动. 每轮在方块移动后输出所有方块围成的总周长.

`思维`

由于 $n$ 取到 $2e5$, 很明显不能使用模拟.

实际上由于方块只会进行一次移动操作,我们可以不移动方块,而是统计每个方块的贡献值.

```cpp
#include<bits/stdc++.h>

const int maxn = 2e5 + 17;
int cntx[maxn],cnty[maxn];
int ansx, ansy;
int main(){
    int n;
    std::cin >> n;
    for(int i = 0; i < n; i++){
        int x,y;
        std::cin >> x >> y;
        cntx[x]++;
        cnty[y]++;
        if(cntx[x] == 1){
            ansx+=2;
        }
        if(cntx[x-1] < cntx[x] && cntx[x] > cntx[x+1]){
            ansx+=2;
        }else if(cntx[x-1] >= cntx[x] && cntx[x] <= cntx[x+1]){
            ansx-=2;
        }
        if(cnty[y] == 1){
            ansy+=2;
        }
        if(cnty[y-1] < cnty[y] && cnty[y] > cnty[y+1]){
            ansy+=2;
        }else if(cnty[y-1] >= cnty[y] && cnty[y] <= cnty[y+1]){
            ansy-=2;
        }
        std::cout << ansx << " " << ansy << "\n";
    }
}
```

## G - Grade Point Average

> 给出科目数量和精确到的小数位数,输出平均分数

`高精`

```cpp
#include<bits/stdc++.h>

int read(){
    int x=0,f=1; char ch=getchar();
    while(ch>'9'||ch<'0'){ if(ch=='-'){ f=-1; } ch=getchar(); }
    while(ch>='0'&&ch<='9'){ x=(x<<3)+(x<<1)+(ch^48); ch=getchar(); }
    return x*f; 
}

int n,k;
int divide(int div){
    if(div%n==0){
        std:: cout<<div/n;
        return -1;
    }
    std:: cout<<div/n;
    return div%n;
}

int main(){
    n=read(); k=read();
    int sum=0;
    for(int i=1;i<=n;i++){
        int x=read();
        sum+=x;
    }
    std:: cout<<int(sum/n);
    if(k==0){
        return 0;
    }
    std:: cout<<".";
    int temp=sum%n;
    for(int i=1;i<=k;i++){
        temp=(temp<<3)+(temp<<1);
        temp=divide(temp);
        if(temp==-1){
            for(int j=i+1;j<=k;j++){
                std:: cout<<"0";
            }
            return 0;
        }
    }
    return 0;
}
```

## H - Adventurer's Guild

> Yuna 拥有 $H$ 点血量和 $S$ 点体力. 现在有 $n$ 个怪物, 每个怪物需要消耗 Yuna $h_i$ 点血量和 $s_i$ 点体力才能被击败, 同时 Yuna 能获得 $w_i$ 点金币. 当 Yuna 的体力归零后消耗体力会减少对应数量的血量. 输出 Yuna 所能获得的最大金币数量

`01 背包`

~~像 01 背包变形~~

递推公式:

$$
f(i,H,S) = \begin{cases}
\max\\{f(i-1, H, S), f(i-1, H - h_i, S - s_i) + w_i\\}, S \ge s_i \\\\
\max\\{f(i-1, H, S), f(i-1, H - h_i - (s_i - S), 0) + w_i\\}, S \lt s_i
\end{cases}
$$

不过我们需要进行压维, 由于每个怪物只能打一次, 需要让 H 和 S 倒序循环

```cpp
using ll = long long;
const int N = 1000 + 17;
const int M = 300 + 17;
ll dp[M][M];
ll n, h, s;
struct Node{
  ll h, s, w;
} a[N];
int main(){
  std::cin >> n >> h >> s;
  for (int i = 1; i <= n; i++)
    std::cin >> a[i].h >> a[i].s >> a[i].w;
  for (int i = 1; i <= n; i++){
    for (int j = h; j >= 1; j--){
      for (int k = s; k >= 0; k--){
        if (j > a[i].h && j + k > a[i].s + a[i].h){
          if (k >= a[i].s)
            dp[j][k] = std::max(dp[j][k], dp[j - a[i].h][k - a[i].s] + a[i].w);
          else
            dp[j][k] = std::max(dp[j][k], dp[j - a[i].h - (a[i].s - k)][0] + a[i].w);
        }
      }
    }
  }
  std::cout << dp[h][s] << std::endl;
  return 0;
}
```


## M - Matrix Problem
> 给出一个 01 矩阵 C, 构造矩阵 A 和 B. 要求矩阵 A 和 B 的与运算结果为 C, 且 A 和 B 中的 1 互相联通

`思维`

如果在 C 的对应位置为 1, 则填充1,否则 A 填充奇数行和最左侧一列, B 填充偶数行和最右侧一列. 

```cpp
#include<bits/stdc++.h>

int read(){
    int x=0,f=1; char ch=getchar();
    while(ch>'9'||ch<'0'){ if(ch=='-'){ f=-1; } ch=getchar(); }
    while(ch>='0'&&ch<='9'){ x=(x<<3)+(x<<1)+(ch^48); ch=getchar(); }
    return x*f; 
}

const int maxn = 511;

int a[maxn][maxn];
int b[maxn][maxn];
int c[maxn][maxn];

int main(){
    int n=read(),m=read(); 
    for(int i=1;i<=n;i++){
        for(int j=1;j<=m;j++){
            a[i][j]=b[i][j]=c[i][j]=getchar()^48;
        }
        getchar();
    }
    for(int i=1;i<=n;i+=2){
        for(int j=1;j<m;j++){
            a[i][j]=1;
        }
    }
    for(int i=2;i<=n;i+=2){
        for(int j=2;j<=m;j++){
            b[i][j]=1;
        }
    }
    for(int i=1;i<=n;i++){
        a[i][1]=b[i][m]=1;
    }
    for(int i=1;i<=n;i++){
        for(int j=1;j<=m;j++){
            std:: cout<<a[i][j];
        }
        std:: cout<<std:: endl;
    }
    for(int i=1;i<=n;i++){
        for(int j=1;j<=m;j++){
            std:: cout<<b[i][j];
        }
        std:: cout<<std:: endl;
    }
    return 0;
}
```