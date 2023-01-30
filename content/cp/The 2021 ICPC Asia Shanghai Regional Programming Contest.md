---
title: "The 2021 ICPC Asia Shanghai Regional Programming Contest"
date: 2023-01-16T10:35:31+08:00
draft: false
tags:
  - Competitive Programming
  - ICPC
  - 上海 
  - 训练
  - 题解
---


上海就是神仙打架

<table>
<tr>
<td>

[题目链接](https://codeforces.com/gym/103446/)

</td>
<td>
<center>

[官方题解](https://codeforces.com/gym/103446/attachments/download/14828/LiyuuCute.pdf)

</center>

~~竟然是ppt，他真的，我哭死~~

</td>
</tr>
</table>


# D - Strange Fractions

> 给出整数$p$和$q$，找到两个正整数满足$\frac{p}{q} = \frac{a}{b} + \frac{b}{a}$

`数学`

使用换元法，令$y=\frac{p}{q}, x=\frac{a}{b}$

则原式等于$y=x + \frac{1}{x}$

即 $x^2 - xy + 1 = 0$

题目中已经给了 $y$，我们只需要找到其中一个 $x$即可。

当 $\Delta=y^2-4\lt 0$时，输出 `Impossible`

在计算过程中全程使用分数。

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
ll gcd(ll p,ll q){
    ll t;
    t=p;
    while(t!=0){
        t=p%q;
        p=q;
        q=t;
    }
    return p;
}
int main(){
    int index=1;
    int count=1;
    cin>>count;
    for(int i=0;i<count;i++){
        ll p,q;
        cin>>p>>q;
        ll t1=p*p-4*q*q;
        ll t2=sqrt(t1);
        if(t2*t2==t1)
            index=1;
        else
            index=0;
        ll gcdd=gcd(p+t2,q*2);
        if(index==0)
            printf("0 0\n");
        else{
            cout<<q*2/gcdd<<" "<<(p+t2)/gcdd<<endl;
        }
    }
}
```

# E - Strange Integers

> 给 $n$ 个整数 $A_1,A_2,\cdots,A_n$和整数 $k$，从中任选一些数字，要求任选的两个数字的差的绝对值大于 $k$，输出最大可选择的数字数量

`签到` `贪心`

```cpp
#include<bits/stdc++.h>
 
#include<iostream>
// ------------ Minify with Regex "^\s*(?!#)(.*)\n" -> "$1 " ------------
template <class A, class B> std::ostream &operator<<(std::ostream &s, std::pair<A, B> const &a) { return s << "(" << std::get<0>(a) << ", " << std::get<1>(a) << ")"; } template <size_t n, typename... T> typename std::enable_if<(n >= sizeof...(T))>::type print_tuple(std::ostream &, const std::tuple<T...> &) {} template <size_t n, typename... T> typename std::enable_if<(n < sizeof...(T))>::type print_tuple(std::ostream &os, const std::tuple<T...> &tup) { if (n != 0) os << ", "; os << std::get<n>(tup); print_tuple<n + 1>(os, tup); } template <typename... T> std::ostream &operator<<(std::ostream &os, const std::tuple<T...> &tup) { os << "("; print_tuple<0>(os, tup); return os << ")"; } template <class T> std::ostream &print_collection(std::ostream &s, T const &a) { s << '['; for (auto it = std::begin(a); it != std::end(a); ++it) { s << *it; if (it != std::prev(end(a))) s << ", "; } return s << ']'; } template <class T, class U> std::ostream &operator<<(std::ostream &s, std::map<T, U> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::set<T> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::vector<T> const &a) { return print_collection(s, a); } void __debug_out() { std::cerr << std::endl; } template <typename T, class = typename std::enable_if<std::is_pointer<T>::value>::type> void __debug_out(T beg, T end) { std::cerr << '['; for (auto it = beg; it != end; it++) { std::cerr << *it; if (it != std::prev(end)) { std::cerr << ", "; } } std::cerr << ']' << std::endl; } template <typename H, typename... Tail> void __debug_out(H h, Tail... T) { std::cerr << " " << h; __debug_out(T...); }
#ifndef ONLINE_JUDGE
#define debug_do if(true)
#else
#define debug_do if(false)
#endif
#define debug(...) debug_do std::cerr << "[" << #__VA_ARGS__ << "]:", __debug_out(__VA_ARGS__)
 
using ll = long long;
ll n,k;
std::vector<ll> seq;
int main(){
#define int ll
    std::cin >> n >> k;
    seq.resize(n);
    for(int i = 0; i < n; i++){
        std::cin >> seq[i];
    }
    std::sort(seq.begin(), seq.end());
 
    int r = n-1;
    int ans = 0;
    int l = n- 2;
    while(l >= 0){
        if(seq[r] - seq[l] >= k){
            ans++;
            r = l;
        }else{
            l--;
        }
    }
    std::cout << ans + 1;
    return 0;
}
```

# G - Edge Group
> 一个有 $n$ 个顶点 $n-1$条边的无向连通图，n是奇数。将其$n-1$条边分为$\frac{n-1}{2}$组，满足下列约束条件
> - 每组中只有两个边
> - 一组中的两个边有一个公共顶点
>
> 输出分组方案模 $998244353$

`树形dp` `组合数学`

首先考虑 $n$ 个边两两分组的情况。

- 如果 $n$ 是奇数，多出来的$1$条边肯定要和父节点上的边进行配对，也就是$n-1$条边相互配对，剩下一条和父节点的配对。
- 如果 $n$ 是偶数，那么这些边就要两两相互配对

当 $n$ 为偶数的时候我们需要考虑两两分组有几种情况。

考虑$n=2$有1种分法，$n=4$时，新加的两个边中的一条边必须和之前的两个边之一配对，要么和另一个新加的边配对，一个有 $(2+1)\times f(1)$ 种分法。推广到 $f(n) = (n-1)\times f(n-2)$。即 $f(n) = (n-1)!!$

那么现在就可以得出转移方程:设 k 为子树中奇儿子的数量。

$$
dp[i]=\begin{cases}
(k-1)!! \cdot \prod dp[son] \\\\
k!! \cdot \prod dp[son]
\end{cases}
$$

```cpp
// 自分の得意な言語で
// Let's チャレンジ！！

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

const int maxn =  1e5 + 17;
ll dp[maxn];
ll size[maxn];
std::vector<int> g[maxn];

const int modd = 998244353;

int n;

void dfs(int u, int fa){
  int cnt = 0;
  dp[u] = 1;
  for(auto v: g[u]){
    if(v == fa) continue;
    dfs(v,u);
    if(size[v] % 2 == 0){
      size[u]++;
    }
    dp[u] = dp[u] * dp[v] % modd;
  }

  for(int i = 1; i <= size[u]; i+=2){
    dp[u] = dp[u] * i % modd;
  }

}

void solve(const std::size_t testcase) {
  std::cin >> n;
  rep1(i, n-1){
    int a,b;
    std::cin >> a >> b;
    g[a].push_back(b);
    g[b].push_back(a);
  }

  dfs(1,0);
  std::cout << dp[1];
}
```

# I - Steadily Growing Steam
> 有 $n$ 张牌，每张牌具有一个点数$t_i$和一个价值$v_i$共两个属性。选择 $\le k$ 张牌，将其点数扩大一倍，然后将这 $n$ 种牌分为两部分，要求两部分的点数和相等，求最大的价值和。

`背包DP`

 
先不考虑 $k$ 次扩大，只考虑 $n$ 张牌分为两部分。

可以用 $dp[i][j]$ 表示考虑前 $i$ 个物品时，$\sum t_i$ = j时所取的$\sum v_i$

考虑 $k$ 次扩大之后可以用 $dp[i][j][k]$ 表示考虑前 $i$ 个物品时，执行了$k$次扩大操作后，$\sum t_i = j$时所取的 $\sum v_i$ 值

~~不是~~很明显

$$
dp[i][j][k] =  \begin{cases}
dp[i-1][j][k] \text{不选择第} i \text{个物品} \\\\
dp[i-1][j-t_i][k] \text{选择第} i \text{个物品，不翻倍} \\\\
dp[i-1][j+t_i][k] \\text{选择第} i \text{个物品，不翻倍，放到另一堆（即约为选择负的）} \\\\
dp[i-1][j-t_i\times 2][k-1] \text{选择第} i \text{个物品，翻倍} \\\\
dp[i-1][j+t_i\times 2][k-1] \\text{选择第} i \text{个物品，翻倍，放到另一堆（即约为选择负的）} \\\\
\end{cases}
$$
 
额外处理一下 $j$ 维的负数问题即可。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=103;
using ll = long long;
ll f[N][3003][N],w[N],v[N];
int main()
{
	memset(f,-0x3f,sizeof f);
	f[0][1300][0]=0;
	int n,m;
	cin>>n>>m;
	for(int i=1;i<=n;i++)
		scanf("%lld%lld",&w[i],&v[i]);
	for(int i=1;i<=n;i++)
	for(int j=0;j<=m;j++)
	for(int k=0;k<=2600;k++)
	{
		f[i][k][j]=f[i-1][k][j];
		if(k>=2*v[i]&&j>=1)
			f[i][k][j]=max(f[i][k][j],f[i-1][k-2*v[i]][j-1]+w[i]);
		if(k>=v[i])
			f[i][k][j]=max(f[i][k][j],f[i-1][k-v[i]][j]+w[i]);
		if(k+2*v[i]<=2600&&j>=1)
			f[i][k][j]=max(f[i][k][j],f[i-1][k+2*v[i]][j-1]+w[i]);
		if(k+v[i]<=2600)
			f[i][k][j]=max(f[i][k][j],f[i-1][k+v[i]][j]+w[i]);
	}
	ll ans=-0x3f3f3f3f;
	for(int i=0;i<=m;i++)
		ans=max(ans,f[n][1300][i]);
	cout<<ans;
	return 0;
}
```
