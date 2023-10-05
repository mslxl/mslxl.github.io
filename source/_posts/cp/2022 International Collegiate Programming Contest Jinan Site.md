---
title: "2022 International Collegiate Programming Contest Jinan Site"
date: 2023-01-28T17:46:28+08:00
draft: false
mathjax: true
categories:
  - 题解
tags:
  - Competitive Programming
  - ICPC
---

[Gym-104076](https://codeforces.com/gym/104076)

## A - Tower

> 有 $n$ 个塔, 每个塔的高度为 $a_i$. 首先先移除其中 $m$ 个塔, 然后可以进行以下操作:
>
> - 将一个塔的高度 $a_i$ 加 1
> - 将一个塔的高度 $a_i$ 减 1
> - 将一个塔的高度 $a_i$ 折半,结果向下取整
>
> 操作中,塔的高度不允许取 $0$, 现在要使剩下的 $n-m$ 个塔的高度相同, 问最小的操作次数.

`思维`

比较暴力的一种做法, 首先大胆猜测最终所有的塔取的结果一定是通过折半获得的,而数越大时,折半时变化越大,因此其他的元素一定是先进行折半,再进行加减操作

在读入数字的时候首先将所有可能取的值存入 `std::set div2`, 然后对每个数 $i \in div2$,求出数 $a_i$ 到 $i$ 的所需的变化次数.找到最小的即可

```cpp
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
   read(t);
  // std::ios::sync_with_stdio(false); std::cin.tie(nullptr); std::cout.tie(nullptr);
  rep1(i, t) solve(t);
  return 0;
}
// clang-format on
 
#define int ll
std::vector<int> seq;
std::set<int> div2;
 
int gain_op_times(int num, int target){
  if(num == target){
    return 0;
  }
  if(num < target){
    return target - num;
  }
  int times= 0;
  while(num / 2 >= target){
    times++;
    num/=2;
  }
  int res = (num - target) + times;
  if(num / 2 > 0){
      res = std::min(res, (target - num/2) + 1 + times) ;
  }
 
  return res;
}
 
void solve(const std::size_t testcase) {
  int n, m;
  read(n, m);
  seq.resize(n);
  div2.clear();
 
  rep(i, n) {
    int a;
    read(a);
    seq[i] = a;
    while(a != 0){
      div2.insert(a);
      a/=2;
    }
  }
 
  ll ans = std::numeric_limits<ll>::max();
  for(auto target: div2) {
    std::vector<int> diff(n);
    rep(i, n) diff[i] = gain_op_times(seq[i], target);
    std::sort(diff.begin(), diff.end());
    ll cur_ans = std::accumulate(diff.begin(), diff.end() - m, 0LL);
    ans = std::min(cur_ans, ans);
  }
  std::cout << ans << "\n";
}
```

## E - Identical Parity
> 定义序列的 value 为该序列所有数字的和
>
> 判断是否存在长度为 $n$ 的排列, 他们所有长度为 $k$ 的子段的 value 具有相同的奇偶性.
>
> 输入 $T$ 表示测试样例数,对于每个样例,输入 $n$ 和 $k$ 两个数. $(1\le k \le n \le 10^9)$

`思维` `数学`

当 $k$ 为偶数时,很明显可以对 `奇偶奇偶...` 这种排列选取相同数量的奇数和偶数,因此这道题只需要考虑当 $k$ 为偶数的情况.

# M - Best Carry Player

> 两个数相加，输出进行了几次进位

`签到`


```cpp
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
  // std::ios::sync_with_stdio(false); std::cin.tie(nullptr); std::cout.tie(nullptr);
  rep1(i, t) solve(t);
  return 0;
}
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
void solve(const std::size_t testcase) {
  int n;
  read(n);
  std::vector<std::string> seq(n);
  rep(i, n) {
    std::cin >> seq[i];
    std::reverse(seq[i].begin(), seq[i].end());
  }
 
  ll ans = 0;
  auto mappend = [&ans](const std::string lhs,
                        const std::string rhs) -> std::string {
    std::string result;
    int carry = 0;
    int adv_carry = 0;
    for (int i = 0, len = std::max(lhs.size(), rhs.size()); i < len; i++) {
      int lnum = i < lhs.size() ? lhs[i] - '0' : 0;
      int rnum = i < rhs.size() ? rhs[i] - '0' : 0;
      if (lnum + rnum + carry >= 10) {
        ans++;
        carry = 1;
      } else {
        carry = 0;
      }
      result += std::to_string((lnum + rnum + adv_carry) % 10);
      adv_carry = carry;
    }
    if(adv_carry > 0){
        result += std::to_string(adv_carry);
    }
    return result;
  };
  std::string mempty("");
  std::reduce(seq.begin(), seq.end(), mempty, mappend);
 
  std::cout << ans << "\n";
}
```
