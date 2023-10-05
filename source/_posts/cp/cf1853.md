---
title: "Codeforces Round 891 (Div. 3) A-G"
date: 2023-08-08T22:00:52+08:00
draft: false
tags:
  - Competitive Programming
  - Codeforces
---

## A. Array Coloring
> 给一个长度为 $n$ 的数组，判断数组能否分为两组元素的加和的奇偶性相同的两组

`思维`

考虑数组中奇数的数量，由于`奇数 + 奇数 = 偶数`，`奇数 + 偶数 = 奇数`，如果有偶数个奇数，我们可以将奇数其平分到两个数组中，否则无论如何都无法满足条件

```cpp
void solve(const std::size_t testcase) {
  multitest{
    std::vector<i32> s(n);
    reads(all(s));
    int odd = 0;
    for(auto i : s)
      if(i % 2 != 0)
        odd++;
    std::cout << (odd % 2 == 0 ? "YES": "NO");
  }
}
```

## B. Maximum Rounding
> 四舍五入到某一位置，使的数字最大。该操作可以执行多次，输出最大的数字

`高精`

直接模仿高精度，从最低位开始判断

```cpp
void solve() {
  multitest {
    std::string a;
    std::cin >> a;
    a = "0" + a;
    std::vector<int> s(a.size());
    std::vector<int> mask(a.size());
    for (int i = 0; i < a.size(); i++) s[i] = a[i] - '0';
    
    for (int i = s.size() - 1; i > 0; i--) {
      if (s[i] >= 5) {
        s[i - 1]++;
        mask[i] = 1;
      }
    }

    bool flag = false;
    for (int i = 0; i < s.size(); i++) {
      if (i == 0 && s[i] == 0) continue;
      flag = flag || mask[i];
      if (flag) std::cout << 0;
      else std::cout << s[i];
    }
  }
}
```

## C. Assembly via Minimums

> 长度为 $n$ 的序列 a 可以通过特定规则变化成长度为 $\frac{n(n-1)}{2}$ 的序列 b，现在输入一个序列 b，输出任意一种能变换成 b 的序列 a。
>
> 变化规则是：$b = \\{ min(a_i, a_j) \mid i \in [1, norm(a)] \land i \in [1, norm(a)] \land i \ne j \\}$

`思维`

手玩样例可以发现，如果一个数在 b 中出现了 $m$ 次，那么它在 a 中一定有 $m$ 个比它大的数，由于题目保证一定有解，因此可以对 b 序列排序后直接输出

```cpp
void solve() {
  mtt {
    i32 n;
    read(n);
    i32 m = n * (n - 1) / 2;
    std::vector<int> s(m);
    reads(all(s));
    
    std::sort(all(s));
    for(int i = 0; i < m; i+=--n){
      std::cout << s[i] << ' ';
    }
    std::cout << *std::max_element(all(s));
  }
}
```

## D. Strong Vertices

> 输入两个数组 a 和 b。构造一个有向图，如果 $a_u - a_v \ge b_u - b_v(u \ne v)$， 那么 $u$ 到 $v$ 就有一条边。
>
> 输出有多少个顶点可以直接到达其他所有顶点

`思维`

式子变形成 $a_u - b_u \ge a_v - b_v$，然后只需要统计满足 $\forall v ,a_u - b_u \ge a_v - b_v$ 的数量即可

```cpp
using pii = std::pair<int, int>;
void solve(const std::size_t testcase) {
  mtt {
    int n;
    read(n);
    std::vector<int> a(n), b(n);
    reads(all(a)); reads(all(b));
    
    std::vector<pii> ans(n);
    rep(i, n){
      ans[i].first = a[i] - b[i];
      ans[i].second = i+1;
    }
    std::sort(rall(ans));

    std::vector<int> real;
    real.pb(ans[0].second);
    for(int i = 1; i < ans.size(); i++)
      if(ans[i].first == ans[0].first)
        real.pb(ans[i].second);

    std::sort(all(real));

    std::cout << real.size() << "\n";
    for(auto i : real) std::cout << i << " ";
  }
}

```

## E. Power of Points

玩样例可以发现 $\sum f_i$ 实际上是区间的长度，因此答案可以所以一个前缀和和后缀和求解答

```cpp
void solve() {
  mtt {
    int n;
    std::cin >> n;
    long long s1 = 0, s2 = 0;
    for (int i = 1; i <= n; i++) {
      std::cin >> x[i].first;
      x[i].second = i;
      s2 += x[i].first;
    }
    sort(x + 1, x + n + 1);
    for (int i = 1; i <= n; i++) {
      s2 -= x[i].first;
      s1 += x[i].first;
      a[x[i].second] = n + 1ll * x[i].first * (2 * i - n) - s1 + s2;
    }
    for (int i = 1; i <= n; i++) std::cout << a[i] << " ";
  }
}
```

## F. Sum and Product

> 解方程, 统计满足下式的解的数量
> $$
>\begin{cases}
> a_i a_j = x \\\\
> a_i + a_j = y
>\end{cases}
> $$

`数学`

~~解一元二次方程~~

```cpp
void solve(const std::size_t testcase) {
  mtt {
    int n;
    read(n);
    std::map<int, int> cnt;
    rep(i, n) {
      int s;
      read(s);
      cnt[s]++;
    }

    int q;
    read(q);
    while (q--) {
      int a, b;
      read(a, b);
      i64 x = (a - sqrt(a * a - 4 * b)) / 2, y = (a + sqrt(a * a - 4 * b)) / 2;

      if (!(x + y != a || x * y != b) && x == y) {
        std::cout << cnt[x] * (cnt[y] - 1) / 2 << " ";
      } else if (!(x + y != a || x * y != b)) {
        std::cout << cnt[x] * cnt[y] << " ";
      } else {
        std::cout << 0 << " ";
      }
    }
  }
}

```

## G. Counting Graphs

> 输入一棵有 $n$ 个顶点的最小生成树，每一条边权为 $w_i$。统计有多少中加边方案使得满足以下条件
> 1. 无重边，自环
> 2. 所有边权不超过 $S$
> 3. 加边之后的产生的图的最小生成树唯一
> 4. 最小生成树是最初时给出的树
>
> 答案 mod $998244353$ 

`最小生成树` `组合数学` `思维`


```cpp
const int maxn = 2e5 + 17;
const int modd = 998244353;

int fa[maxn], sz[maxn], rk[maxn];

struct edge {
  i64 u, v, w;
  bool operator<(const edge &rhs) const { return w < rhs.w; }
};

int find(int x) {
  while (fa[x] != x) x = fa[x];
  return x;
}
void join(int x, int y) {
  x = find(x);
  y = find(y);
  if(x == y) return;
  if(rk[x] > rk[y]){
    fa[y] = x;
    sz[x] += sz[y];
  }else if(rk[x] < rk[y]){
    fa[x] = y;
    sz[y] += sz[x];
  }else{
    fa[x] = y;
    rk[y]++;
    sz[y]+=sz[x];
  }
}

template <typename A, typename BaseT>
typename std::enable_if<std::is_integral<BaseT>::value, A>::type qpow(
    A a, BaseT n, BaseT modd) {
  decltype(a) ans = 1;
  while (n) {
    if (n & 1) ans = (ans * a) % modd;
    n >>= 1;
    a = (a * a) % modd;
  }
  return ans % modd;
}

void solve() {
  // std::ios::sync_with_stdio(false); std::cin.tie(nullptr);
  // std::cout.tie(nullptr);
  mtt {
    int n, S;
    read(n, S);
    for (int i = 0; i <= n; i++) {
      fa[i] = i;
      sz[i] = 1;
    }
    std::vector<edge> a(n - 1);
    for (int i = 0; i < n - 1; i++) {
      std::cin >> a[i].u >> a[i].v >> a[i].w;
    }
    i64 ans = 1;
    std::sort(a.begin(), a.end());
    for (int i = 0; i < n - 1; i++) {
      i64 szu = sz[find(a[i].u)];
      i64 szv = sz[find(a[i].v)];

      ans = ans * qpow(S - a[i].w + 1, szu * szv - 1, modd) % modd;
      join(a[i].u, a[i].v);
    }
    std::cout << ans;
  }
}
```
