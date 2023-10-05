---
title: 树形 DP 练习
date: 2023-01-18T14:54:04+08:00
draft: false
tags:
  - Competitive Programming
---

前几天基本每场都遇到树形DP，趁此熟悉抓紧练练

在网上找了个树形DP专项


# [P1352: 没有上司的舞会](https://www.luogu.com.cn/problem/P1352)

热个身

$$
\begin{cases}
f[i][0] = \sum_{son}{\text{ReLU}(\max{(f[son][0], f[son][1]))}}\\\\
f[i][1] = \sum_{son}{\text{ReLU}(f[son][0])}
\end{cases}
$$

其中 $f[i][j]$ 中的$i$表示当前节点编号，$j$表示是否参加舞会

~~加**ReLU**是因为怎么有人去了还不高兴啊~~

54 行后才是代码主体


```cpp
// clang-format off
#include <bits/stdc++.h> 
#include <limits>
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

// clang-format off
template <std::size_t MAX_SIZE_EDGE, class TData = int> struct graph {
  struct node {
    int to{};
    TData data{};
    node(int t, TData d): to(t), data(d){}
  };
  std::array<std::list<node>, MAX_SIZE_EDGE> edges;

  graph() {}

  void add_edge(int u, int v, TData data = TData{}) {
    edges[u].emplace_back(v, data);
  }
  void add_biedge(int u, int v, TData data = TData{}) {
    add_edge(u, v, data), add_edge(v, u, data);
  }
  void clear() { edges.fill(std::list<node>()); }
  std::list<node> &from(std::size_t idx) noexcept { return (*this)[idx]; }
  std::list<node> &operator[](std::size_t idx) noexcept { return edges[idx]; }
};
// clang-format on

// clang-format off
// ------------ Minify with Regex "^\s*(?!#)(.*)\n" -> " " ------------
template <class A, class B> std::ostream &operator<<(std::ostream &s, std::pair<A, B> const &a) { return s << "(" << std::get<0>(a) << ", " << std::get<1>(a) << ")"; } template <size_t n, typename... T> typename std::enable_if<(n >= sizeof...(T))>::type print_tuple(std::ostream &, const std::tuple<T...> &) {} template <size_t n, typename... T> typename std::enable_if<(n < sizeof...(T))>::type print_tuple(std::ostream &os, const std::tuple<T...> &tup) { if (n != 0) os << ", "; os << std::get<n>(tup); print_tuple<n + 1>(os, tup); } template <typename... T> std::ostream &operator<<(std::ostream &os, const std::tuple<T...> &tup) { os << "("; print_tuple<0>(os, tup); return os << ")"; } template <class T> std::ostream &print_collection(std::ostream &s, T const &a) { s << '['; for (auto it = std::begin(a); it != std::end(a); ++it) { s << *it; if (it != std::prev(end(a))) s << ", "; } return s << ']'; } template <class T, class U> std::ostream &operator<<(std::ostream &s, std::map<T, U> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::set<T> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::vector<T> const &a) { return print_collection(s, a); } void __debug_out() { std::cerr << std::endl; } template <typename T, class = typename std::enable_if<std::is_pointer<T>::value>::type> void __debug_out(T beg, T end) { std::cerr << '['; for (auto it = beg; it != end; it++) { std::cerr << *it; if (it != std::prev(end)) { std::cerr << ", "; } } std::cerr << ']' << std::endl; } template <typename H, typename... Tail> void __debug_out(H h, Tail... T) { std::cerr << " " << h; __debug_out(T...); }
#ifndef ONLINE_JUDGE
#define debug_do if(true)
#else
#define debug_do if(false)
#endif
#define debug(...) debug_do std::cerr << "[" << #__VA_ARGS__ << "]:", __debug_out(__VA_ARGS__)
// clang-format on

const int maxn = 6e3 + 17;
const int INF = std::numeric_limits<int>::max();

int n;
int r[maxn];
int fa[maxn];

graph<maxn> g;

int dp[maxn][2];

template <class T> decltype(auto) ReLU(T x) { return x > 0 ? x : 0; }

void dfs(int x) {
  dp[x][0] = 0;
  dp[x][1] = r[x];

  for (auto &[v, _] : g[x]) {
    dfs(v);
    dp[x][0] += ReLU(std::max(dp[v][0], dp[v][1]));
    dp[x][1] += ReLU(dp[v][0]);
  }

  debug(x);
  debug(dp[x][0]);
  debug(dp[x][1]);
}

void solve(const std::size_t testcase) {
  read(n);
  rep1(i, n) read(r[i]);
  rep(i, n - 1) {
    int l, k;
    read(l, k);
    g.add_edge(k, l);
    fa[l] = k;
  }

  int rt = 1;
  while (fa[rt] != 0) {
    rt = fa[rt];
  }
  debug(rt);
  dfs(rt);
  std::cout << std::max(dp[rt][0], dp[rt][1]);
}
```

# [P2016 战略游戏](https://www.luogu.com.cn/problem/P2016)

~~DAG也是树，对吧~~

$$
\begin{cases}
f[i][1] = \sum_{son}{\min{(f[son][0], f[son][1])}}\\\\
f[i][0] = \sum_{son}{f[son][1]}
\end{cases}
$$

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

// clang-format off
template <std::size_t MAX_SIZE_EDGE, class TData = int> struct graph {
  struct node {
    int to{};
    TData data{};
    node(int t, TData d): to(t), data(d){}
  };
  std::array<std::list<node>, MAX_SIZE_EDGE> edges;

  graph() {}

  void add_edge(int u, int v, TData data = TData{}) {
    edges[u].emplace_back(v, data);
  }
  void add_biedge(int u, int v, TData data = TData{}) {
    add_edge(u, v, data), add_edge(v, u, data);
  }
  void clear() { edges.fill(std::list<node>()); }
  std::list<node> &from(std::size_t idx) noexcept { return (*this)[idx]; }
  std::list<node> &operator[](std::size_t idx) noexcept { return edges[idx]; }
};
// clang-format on

const int maxn = 1.5e3 + 17;
int n;
graph<maxn> g;
bool vis[maxn];
int dp[maxn][2];

void dfs(int x){
  vis[x] = true;
  dp[x][1] = 1;
  dp[x][0] = 0;

  for(auto &[v,_]: g[x]){
    if(vis[v]) continue;
    dfs(v);
    dp[x][1] += std::min(dp[v][0], dp[v][1]);
    dp[x][0] += dp[v][1];
  }
}

void solve(const std::size_t testcase) {
  read(n);
  rep(_i, n){
    int i;
    int k;
    read(i,k);

    rep(j, k){
      int r;
      read(r);
      g.add_biedge(i, r);
    }
  }
  dfs(0);
  std::cout << std::min(dp[0][0], dp[0][1]);

}

```


# [ABC259F Select Edges](https://atcoder.jp/contests/abc259/tasks/abc259_f?lang=en)

写不出来状态转移方程

使用 $dp[i][j]$ 表示第 $i$ 个节点是否与父节点相连，当$j=0$时表示不相连，当$j=1$时表示相连。

在 dfs 时进行讨论，首先肯定要优先选择 $dp[son][1] +w[i] - dp[son][0]$ 大的边进行加边。
- 当 $d[son] =0$ 或 $w[i] \le 0$ 时，不进行加边，此时
  + $dp[i][0] += dp[son][0]$
  + $dp[i][1] += dp[son][0]$
- 当与父节点连接时
  + $dp[i][1] += \max (dp[v][0]， dp[v][1] + w[i])$，该操作最多加$dp[v][1]+w[i]$ $d[i]-1$次
  + $dp[i][1] += dp[v][0]$ 不能进行上述操作后

- 当不与父节点相连时
  + $dp[i][0] += \max (dp[v][0]， dp[v][1] + w[i])$，该操作最多加$dp[v][1]+w[i]$ $d[i]$次
  + $dp[i][0] += dp[v][0]$ 不能进行上述操作后


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

// clang-format off
template <std::size_t MAX_SIZE_EDGE, class TData = int> struct graph {
  struct node {
    int to{};
    TData data{};
    node(int t, TData d): to(t), data(d){}
  };
  std::array<std::list<node>, MAX_SIZE_EDGE> edges;

  graph() {}

  void add_edge(int u, int v, TData data = TData{}) {
    edges[u].emplace_back(v, data);
  }
  void add_biedge(int u, int v, TData data = TData{}) {
    add_edge(u, v, data), add_edge(v, u, data);
  }
  void clear() { edges.fill(std::list<node>()); }
  std::list<node> &from(std::size_t idx) noexcept { return (*this)[idx]; }
  std::list<node> &operator[](std::size_t idx) noexcept { return edges[idx]; }
};
// clang-format on

// clang-format off
// ------------ Minify with Regex "^\s*(?!#)(.*)\n" -> " " ------------
template <class A, class B> std::ostream &operator<<(std::ostream &s, std::pair<A, B> const &a) { return s << "(" << std::get<0>(a) << ", " << std::get<1>(a) << ")"; } template <size_t n, typename... T> typename std::enable_if<(n >= sizeof...(T))>::type print_tuple(std::ostream &, const std::tuple<T...> &) {} template <size_t n, typename... T> typename std::enable_if<(n < sizeof...(T))>::type print_tuple(std::ostream &os, const std::tuple<T...> &tup) { if (n != 0) os << ", "; os << std::get<n>(tup); print_tuple<n + 1>(os, tup); } template <typename... T> std::ostream &operator<<(std::ostream &os, const std::tuple<T...> &tup) { os << "("; print_tuple<0>(os, tup); return os << ")"; } template <class T> std::ostream &print_collection(std::ostream &s, T const &a) { s << '['; for (auto it = std::begin(a); it != std::end(a); ++it) { s << *it; if (it != std::prev(end(a))) s << ", "; } return s << ']'; } template <class T, class U> std::ostream &operator<<(std::ostream &s, std::map<T, U> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::set<T> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::vector<T> const &a) { return print_collection(s, a); } void __debug_out() { std::cerr << std::endl; } template <typename T, class = typename std::enable_if<std::is_pointer<T>::value>::type> void __debug_out(T beg, T end) { std::cerr << '['; for (auto it = beg; it != end; it++) { std::cerr << *it; if (it != std::prev(end)) { std::cerr << ", "; } } std::cerr << ']' << std::endl; } template <typename H, typename... Tail> void __debug_out(H h, Tail... T) { std::cerr << " " << h; __debug_out(T...); }
#ifndef ONLINE_JUDGE
#define debug_do if(true)
#else
#define debug_do if(false)
#endif
#define debug(...) debug_do std::cerr << "[" << #__VA_ARGS__ << "]:", __debug_out(__VA_ARGS__)
// clang-format on

#define int ll
const int maxn = 3e5 + 17;
const int maxw = 1e9;
int n;

int d[maxn];
graph<maxn> g;
bool vis[maxn];
ll dp[maxn][2];

void dfs(int x) {
  vis[x] = true;

  std::vector<std::pair<int, int>> vec;
  for (auto &[v, w] : g[x]) {
    if (vis[v])
      continue;
    dfs(v);
    if (d[v] == 0 || w <= 0) {
      dp[x][0] += dp[v][0];
      dp[x][1] += dp[v][0];
    } else {
      vec.push_back({w, v});
    }
  }

  std::sort(vec.begin(), vec.end(),
            [](const std::pair<int, int> &lhs, const std::pair<int, int> &rhs) {
              return dp[lhs.second][1] + lhs.first - dp[lhs.second][0] >
                     dp[rhs.second][1] + rhs.first - dp[rhs.second][0];
            });

  int cdx = 0;
  for (int i = 0; i < vec.size(); i++) {
    auto &[w, v] = vec[i];
    if (d[v] == 0)
      continue;

    if (dp[v][1] + w > dp[v][0]) {
      cdx++;
      if (cdx <= d[x] - 1) {
        dp[x][1] += dp[v][1] + w;
      } else {
        dp[x][1] += dp[v][0];
      }
      if (cdx <= d[x]) {
        dp[x][0] += dp[v][1] + w;
      } else {
        dp[x][0] += dp[v][0];
      }
    } else {
      dp[x][1] += dp[v][0];
      dp[x][0] += dp[v][0];
    }
  }
}

int inde[maxn];

void solve(const std::size_t testcase) {
  read(n);
  rep1(i, n) { read(d[i]); }
  rep(i, n - 1) {
    int u, v, w;
    read(u, v, w);
    g.add_biedge(u, v, w);
    inde[u]++;
  }
  int rt = std::min_element(inde + 1, inde + 1 + n) - inde;
  dfs(rt);
  std::cout << std::max(dp[rt][0], dp[rt][1]);
}

```

# [P3478 [POI2008] STA-Station](https://www.luogu.com.cn/problem/P3478)

`换根dp`

$dp[son] = dp[fa] + (n - dp[son]) - dp[son]$


```cpp
// clang-format off
#include <algorithm>
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
  std::ios::sync_with_stdio(false); std::cin.tie(nullptr); std::cout.tie(nullptr);
  rep1(i, t) solve(t);
  return 0;
}
const int maxn = 1e6 + 17;

struct edge{
  int to,next;
}e[maxn * 2];

int head[maxn], eid = 0;

void add_edge(int u, int v){
  eid++;
  e[eid].to = v;
  e[eid].next = head[u];
  head[u] = eid;
}
void add_biedge(int u, int v){
  add_edge(u, v);
  add_edge(v, u);
}

#define int ll
int n;
int inde[maxn];
int size[maxn];
int rt = 0;
int dp[maxn];

int upd_size(int x, int fa, int dep) {
  size[x] = 1;
  int value = dep;
  for (int i = head[x]; i != 0; i = e[i].next) {
    const int v = e[i].to;
    if (v == fa)
      continue;
    value += upd_size(v, x, dep + 1);
    size[x] += size[v];
  }
  return value;
}

void dfs(int x, int fa){
  dp[x] = dp[fa] - size[x] + n - size[x] ;

  for (int i = head[x]; i != 0; i = e[i].next) {
    const int v = e[i].to;
    if(v == fa) continue;
    dfs(v, x);
  }
}

void solve(const std::size_t testcase) {
  read(n);
  rep(i, n-1) {
    int u, v;
    read(u, v);
    add_biedge(u, v);
    inde[v]++;
  }
  rt = 1;

  dp[rt] = upd_size(rt, 0, 0);

  for (int i = head[rt]; i != 0; i = e[i].next) {
    const int v = e[i].to;
    dfs(v, rt);
  }

  std::cout << (std::max_element(dp+1, dp+1+n) - dp);
}
```

