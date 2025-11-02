---
title: 2022 第五届传智杯初赛
pubDate: 2022-12-29
categories:
  - Competitive Programming
  - 传智杯
---

# [A-莲子的软件工程学](https://www.luogu.com.cn/problem/P8869?contestId=92638)

记得开 long long 就好，防止取绝对值时爆炸

```cpp
#include<bits/stdc++.h>

using ll = long long;
using ul = unsigned long long;
using ld = long double;

template <typename T>
inline typename std::enable_if<std::is_integral<T>::value>::type read(T &x){
  char c;T f=1;
  while(!isdigit(c=getchar())) if(c=='-')f=-1;
  x=(c&15); while(isdigit(c=getchar())) x= (x<<1) + (x<<3) + (c&15);
  x*=f;
}

template <typename T, typename... A> void read(T &value, A &..._t) {
  read(value);
  read(_t...);
}

#define rep(NAME, MAX) for(decltype(MAX) NAME = 0; NAME < MAX; i++)
#define rep1(NAME, MAX) for(decltype(MAX) NAME = 1; NAME <= MAX; i++)
#define repv0(NAME, START) for(decltype(START) NAME = START; NAME >= 0; NAME--)
#define repv1(NAME, START) for(decltype(START) NAME = START; NAME >= 1; NAME--)

// main function
void solve(const std::size_t testcase){
  //coding here
  ll a,b;
  std::cin >> a >> b;
  ll sig = b / std::abs(b);
  std::cout << std::abs(a) * sig;
}

#ifdef int
#undef int
#endif
int main(){
  std::size_t t = 1;
  // std::cin >> t;
  for(std::size_t i = 1; i <= t; i++){
    solve(t);
  }
  return 0;
}
```

# [B-莲子的机械动力学](https://www.luogu.com.cn/problem/P8870)

从低位开始逐位相加，然后取模即可

```cpp
#include <bits/stdc++.h>

using ll = long long;
using ul = unsigned long long;
using ld = long double;

// ------------ Minify with Regex "^\s*(?!#)(.*)\n" -> " " ------------
// clang-format off
template <class A, class B> std::ostream &operator<<(std::ostream &s, std::pair<A, B> const &a) { return s << "(" << std::get<0>(a) << ", " << std::get<1>(a) << ")"; } template <size_t n, typename... T> typename std::enable_if<(n >= sizeof...(T))>::type print_tuple(std::ostream &, const std::tuple<T...> &) {} template <size_t n, typename... T> typename std::enable_if<(n < sizeof...(T))>::type print_tuple(std::ostream &os, const std::tuple<T...> &tup) { if (n != 0) os << ", "; os << std::get<n>(tup); print_tuple<n + 1>(os, tup); } template <typename... T> std::ostream &operator<<(std::ostream &os, const std::tuple<T...> &tup) { os << "("; print_tuple<0>(os, tup); return os << ")"; } template <class T> std::ostream &print_collection(std::ostream &s, T const &a) { s << '['; for (auto it = std::begin(a); it != std::end(a); ++it) { s << *it; if (it != std::prev(end(a))) s << ", "; } return s << ']'; } template <class T, class U> std::ostream &operator<<(std::ostream &s, std::map<T, U> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::set<T> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::vector<T> const &a) { return print_collection(s, a); } void __debug_out() { std::cerr << std::endl; } template <typename T, class = typename std::enable_if<std::is_pointer<T>::value>::type> void __debug_out(T beg, T end) { std::cerr << '['; for (auto it = beg; it != end; it++) { std::cerr << *it; if (it != std::prev(end)) { std::cerr << ", "; } } std::cerr << ']' << std::endl; } template <typename H, typename... Tail> void __debug_out(H h, Tail... T) { std::cerr << " " << h; __debug_out(T...); }
#ifndef ONLINE_JUDGE
#define debug(...) std::cerr << "[" << #__VA_ARGS__ << "]:", __debug_out(__VA_ARGS__)
#else
#define debug(...) do {} while (0)
#endif
// clang-format on

template <typename T>
inline typename std::enable_if<std::is_integral<T>::value>::type read(T &x) {
  char c;
  T f = 1;
  while (!isdigit(c = getchar()))
    if (c == '-')
      f = -1;
  x = (c & 15);
  while (isdigit(c = getchar()))
    x = (x << 1) + (x << 3) + (c & 15);
  x *= f;
}

template <typename T, typename... A> void read(T &value, A &..._t) {
  read(value);
  read(_t...);
}

#define rep(NAME, MAX) for (decltype(MAX) NAME = 0; NAME < MAX; NAME++)
#define replr(NAME, START, END) for(ll _sig = ((ll(END)-ll(START))/ std::abs(ll(END)-ll(START))), NAME = START; NAME != END; NAME+=_sig)
#define replrci(NAME, START, END) for(ll _sig = ((ll(END)-ll(START))/ std::abs(ll(END)-ll(START))), NAME = START+_sig; NAME-_sig != END; NAME+=_sig)

#define int ll
// main function
void solve(const std::size_t testcase) {
  int n, m;
  read(n, m);
  int len = std::max(n, m)+1;
  std::vector<int> a(len, 0);
  std::vector<int> b(len, 0);
  std::vector<int> ans(len, 0);

  replrci(i, n, 0) read(a[i]);
  replrci(i, m, 0) read(b[i]);
  rep(i, len){
    int bin = i + 2;
    ans[i] += a[i] + b[i];
    if(ans[i] >= bin){
      ans[i+1] += ans[i] / bin;
      ans[i] %= bin;
    }
  }
  bool nzero = false;
  replrci(i, ans.size(), 0){
    if(ans[i] == 0 && !nzero) continue;
    if(ans[i] != 0) nzero = true;
    std::cout << ans[i] << ' ';
  }
  if(!nzero) std::cout << 0;
}

#ifdef int
#undef int
#endif
int main() {
  std::size_t t = 1;
  // std::cin >> t;
  for (std::size_t i = 1; i <= t; i++) {
    solve(t);
  }
  return 0;
}
```

# [C-莲子的排版设计学](https://www.luogu.com.cn/problem/P8871)

全读进来，粗略统计一下输出结果即可。

值得一提的是如果想要统计数字 x 是几位数字，可以用 $\lg{(x)} + 1$ 计算。

如果不愿意自己对齐空格，可以动态构造格式化字符串，然后用 `std::vformat` 或者 `printf`

```cpp

#include <bits/stdc++.h>
// clang-format off
// ------------ Minify with Regex "^\s*(?!#)(.*)\n" -> " " ------------
template <class A, class B> std::ostream &operator<<(std::ostream &s, std::pair<A, B> const &a) { return s << "(" << std::get<0>(a) << ", " << std::get<1>(a) << ")"; } template <size_t n, typename... T> typename std::enable_if<(n >= sizeof...(T))>::type print_tuple(std::ostream &, const std::tuple<T...> &) {} template <size_t n, typename... T> typename std::enable_if<(n < sizeof...(T))>::type print_tuple(std::ostream &os, const std::tuple<T...> &tup) { if (n != 0) os << ", "; os << std::get<n>(tup); print_tuple<n + 1>(os, tup); } template <typename... T> std::ostream &operator<<(std::ostream &os, const std::tuple<T...> &tup) { os << "("; print_tuple<0>(os, tup); return os << ")"; } template <class T> std::ostream &print_collection(std::ostream &s, T const &a) { s << '['; for (auto it = std::begin(a); it != std::end(a); ++it) { s << *it; if (it != std::prev(end(a))) s << ", "; } return s << ']'; } template <class T, class U> std::ostream &operator<<(std::ostream &s, std::map<T, U> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::set<T> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::vector<T> const &a) { return print_collection(s, a); } void __debug_out() { std::cerr << std::endl; } template <typename T, class = typename std::enable_if<std::is_pointer<T>::value>::type> void __debug_out(T beg, T end) { std::cerr << '['; for (auto it = beg; it != end; it++) { std::cerr << *it; if (it != std::prev(end)) { std::cerr << ", "; } } std::cerr << ']' << std::endl; } template <typename H, typename... Tail> void __debug_out(H h, Tail... T) { std::cerr << " " << h; __debug_out(T...); }
#ifndef ONLINE_JUDGE
#define debug(...) std::cerr << "[" << #__VA_ARGS__ << "]:", __debug_out(__VA_ARGS__)
#else
#define debug(...) do {} while (0)
#endif

using ll = long long; using ul = unsigned long long; using ld = long double;
template <typename T>
inline typename std::enable_if<std::is_integral<T>::value>::type read(T &x){
  char c;T f=1;
  while(!isdigit(c=getchar())) if(c=='-')f=-1;
  x=(c&15); while(isdigit(c=getchar())) x= (x<<1) + (x<<3) + (c&15);
  x*=f;
}
template <typename T, typename... A> void read(T &value, A &..._t) { read(value), read(_t...); }
#define rep(NAME, MAX) for(decltype(MAX) NAME = 0; NAME < MAX; NAME++)
#define replr(NAME, START, END) for(ll _sig = ((ll(END)-ll(START))/ std::abs(ll(END)-ll(START))), NAME = START; NAME != END; NAME+=_sig)
#define replrci(NAME, START, END) for(ll _sig = ((ll(END)-ll(START))/ std::abs(ll(END)-ll(START))), NAME = START+_sig; NAME-_sig != END; NAME+=_sig)
// clang-format on

// coding here
inline void solve(const std::size_t testcase) {
  std::string line;
  std::vector<std::string> lines;
  while (std::getline(std::cin, line)) {
    lines.push_back(line);
  }
  ll linenum = std::log10(lines.size()) + 1;
  std::string fmt = "%" + std::to_string(linenum) + "lld %s\n";

  rep(i,lines.size()){
    printf(fmt.data(), i+1, lines[i].data());
  }
}

#ifdef int
#undef int
#endif
int main() {
  std::size_t t = 1;
  // std::cin >> t;
  for (std::size_t i = 1; i <= t; i++)
    solve(t);
  return 0;
}
```

# [D-莲子的物理热力学](https://www.luogu.com.cn/problem/P8872)

贪心

~~首先要保证自己没有读错题,题目中的$max_j$中的$j$并不是每次自己选择一段区间~~

题目中给了我们 $m$ 次进行操作的机会，我们可以确定当进行一次操作时，只会让当前的极差不变
或者变小，也就是说我们可以尽可能多的进行操作。

我们不可避免的要先让最大值变为最小值，再让最小值变为次大值。

我们可以将 $u$ 个数变大，再将 $u + v$ 个数变小，需要进行 $u+v+u$ 次操作。或者将 $v$ 个数变小，再将 $u+v$ 个数变大, 总共进行 $v + u + v$ 次
操作，也就是说，最终操作次数应该是 $u+v+min(u,v)=m$。

根据这个式子，我们可以推出以下结论：

$$
\begin{cases}
v &= m - 2u & 3u \le m \cr
v &= \frac{m-u}{2} & 3u \gt m
\end{cases}
$$

当我们枚举 $u$ 时，即可算出 $v$ 的取值，每次枚举都能求出一个极差，枚举所有值，找出极差的最小值即可。

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
  // std::cin >> t;
  rep1(i, t) solve(t);
  return 0;
}
// clang-format on
#define int ll
int n, m;
std::vector<ll> seq;

// coding here
void solve(const std::size_t testcase) {
  read(n, m);
  seq.resize(n);
  rep(i, n) read(seq[i]);
  std::sort(seq.begin(), seq.end());

  if (m == 0) {
    std::cout << seq[seq.size() - 1] - seq[0];
    return;
  }
  if (n == 1) {
    std::cout << 0;
    return;
  }

  ll ans = std::numeric_limits<ll>::max();

  for (int u = 0; u <= m && u < seq.size(); u++) {
    int v;
    if (u * 3 <= m) {
      v = m - 2 * u;
    } else {
      v = (m - u) / 2;
    }
    if (u + v >= seq.size()) {
      ans = 0;
      break;
    } else {
      ans = std::min(ans, seq[seq.size() - v - 1] - seq[u]);
    }
  }
  std::cout << ans;
}
```

# [E-莲子的市场经济学](https://www.luogu.com.cn/problem/P8873)

二分

首先通过瞪眼法找通项公式，我们把一个周期看作一组，可以发现第一个组的峰值为 $1$，第二个组的峰值为 $2$...
而且很容易发现每组的数字数量是一个等差数列，通项公式为 $1+4n$

也就是说第 $n$ 组最后一个数字是 $1 + (3n + 2n^2)$，第一个数字是 $1 + (3(n-1) + 2(n-1)^2) + 1$

由于 $k\le 4*1e18$ 可以通过二分的方式来寻找 $k$ 属于哪一组

接下来就是简单的数学题了：

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
  read(t);
  rep1(i, t) solve(t);
  return 0;
}
// clang-format on

ll group_index_maxk(ll n) { return 1 + 3 * n + 2 * n * n; }

// coding here
void solve(const std::size_t testcase) {
  ll k;
  read(k);
  if (k == 1) {
    std::cout << 0 << "\n";
    return;
  }

  ll l = 1, r = 2e9;
  ll group_idx;
  while (l <= r) {
    group_idx = l + (r - l) / 2;
    ll maxk = group_index_maxk(group_idx);
    ll mink = group_index_maxk(group_idx - 1)+1;
    if (mink <= k && k <= maxk)
      break;
    if (maxk < k) {
      l = group_idx + 1;
    } else if (k < mink) {
      r = group_idx - 1;
    }
  }

  ll group_min_k = group_index_maxk(group_idx - 1) + 1;
  ll group_max_k = group_index_maxk(group_idx);
  ll group_peak_ak = group_idx;
  ll group_mid_k = group_min_k + (group_max_k - group_min_k) / 2;
  ll group_peak_span = (group_mid_k - group_min_k) / 2;
  ll top_peak_k = group_min_k + group_peak_span;
  ll bottom_peak_k = group_mid_k + group_peak_span;

  if (k == group_min_k) {
    std::cout << 0 << "\n";
  } else if (k > group_mid_k) {
    if (k > bottom_peak_k) {
      std::cout << -group_idx + (k - bottom_peak_k) << "\n";
    } else {
      std::cout << -(k - group_mid_k) << "\n";
    }
  } else {
    if (k > top_peak_k) {
      std::cout << group_idx - (k - top_peak_k) << "\n";
    } else {
      std::cout << k - group_min_k << "\n";
    }
  }
}
```

# [F-二人的大富翁游戏](https://www.luogu.com.cn/problem/P8874)

大模拟，不想写

# [E-二人的花纹纸游戏](https://www.luogu.com.cn/problem/P8875)

染色二维前缀和

不妨看看[官方题解](https://www.luogu.com.cn/problem/solution/P8875)?

~~它的题面$x,y$的使用顺序正好和我相反，迷惑了半天~~

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
template <class A, class B> std::ostream &operator<<(std::ostream &s, std::pair<A, B> const &a) { return s << "(" << std::get<0>(a) << ", " << std::get<1>(a) << ")"; } template <size_t n, typename... T> typename std::enable_if<(n >= sizeof...(T))>::type print_tuple(std::ostream &, const std::tuple<T...> &) {} template <size_t n, typename... T> typename std::enable_if<(n < sizeof...(T))>::type print_tuple(std::ostream &os, const std::tuple<T...> &tup) { if (n != 0) os << ", "; os << std::get<n>(tup); print_tuple<n + 1>(os, tup); } template <typename... T> std::ostream &operator<<(std::ostream &os, const std::tuple<T...> &tup) { os << "("; print_tuple<0>(os, tup); return os << ")"; } template <class T> std::ostream &print_collection(std::ostream &s, T const &a) { s << '['; for (auto it = std::begin(a); it != std::end(a); ++it) { s << *it; if (it != std::prev(end(a))) s << ", "; } return s << ']'; } template <class T, class U> std::ostream &operator<<(std::ostream &s, std::map<T, U> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::set<T> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::vector<T> const &a) { return print_collection(s, a); } void __debug_out() { std::cerr << std::endl; } template <typename T, class = typename std::enable_if<std::is_pointer<T>::value>::type> void __debug_out(T beg, T end) { std::cerr << '['; for (auto it = beg; it != end; it++) { std::cerr << *it; if (it != std::prev(end)) { std::cerr << ", "; } } std::cerr << ']' << std::endl; } template <typename H, typename... Tail> void __debug_out(H h, Tail... T) { std::cerr << " " << h; __debug_out(T...); }
#ifndef ONLINE_JUDGE
#define debug_do if(true)
#else
#define debug_do if(false)
#endif
#define debug(...) debug_do std::cerr << "[" << #__VA_ARGS__ << "]:", __debug_out(__VA_ARGS__)
// clang-format on

#define int ll
template <typename T> using vvector = std::vector<std::vector<T>>;
const int modd = 998244353;

void solve(const std::size_t testcase) {
  int n, m, r, c;
  read(n, m);
  vvector<int> A(n + 1, std::vector<int>(m + 1));
  rep1(i, n) rep1(j, m) read(A[i][j]);
  read(r, c);
  vvector<int> B(r + 1, std::vector<int>(c + 1));
  rep1(i, r) rep1(j, c) read(B[i][j]);

  vvector<int> pre(A);
  for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= m; j++) {
      int irj = i - r >= 0 ? pre[i - r][j] : 0;
      irj %= modd;
      int ijc = j - c >= 0 ? pre[i][j - c] : 0;
      ijc %= modd;
      int irjc = (i - r) >= 0 && (j - c) >= 0 ? pre[i - r][j - c] : 0;
      irjc %= modd;
      pre[i][j] = (pre[i][j] + irj) % modd;
      pre[i][j] = (pre[i][j] + ijc) % modd;
      pre[i][j] = (pre[i][j] - irjc + modd) % modd;
    }
  }

  debug("Done");
  debug(n, m, r, c);
  int q;
  read(q);
  rep(i, q) {
    int x1, y1, x2, y2;
    read(x1, y1, x2, y2);
    debug(x1, y1, x2, y2);
    int ans = 0;
    for (int i = 1; i <= std::min(r, x2 - x1 + 1); i++) {
      for (int j = 1; j <= std::min(c, y2 - y1 + 1); j++) {
        if (B[i][j] == 0) {
          debug(i, j);
          int rx1 = x1 + i - 1;
          int rx2 = rx1 + (x2 - rx1) / r * r;
          int ry1 = y1 + j - 1;
          int ry2 = ry1 + (y2 - ry1) / c * c;
          debug(rx1, rx2, ry1, ry2);
          debug(rx1 - c, ry2 - r);

          int ret = pre[rx2][ry2];
          int rx1r = rx1 - r >= 0 ? pre[rx1 - r][ry2] : 0;
          int ry1c = ry1 - c >= 0 ? pre[rx2][ry1 - c] : 0;
          int rx1rry1c =
              rx1 - r >= 0 && ry1 - c >= 0 ? pre[rx1 - r][ry1 - c] : 0;

          ret = (ret - rx1r + modd) % modd;
          ret = (ret - ry1c + modd) % modd;
          ret = (ret  + rx1rry1c) % modd;
          ans = (ans + ret) % modd;
        }
      }
    }
    std::cout << ans << "\n";
  }
}
```
