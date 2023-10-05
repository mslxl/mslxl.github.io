---
title: The 2022 ICPC Asia Xian Regional Contest (CHGJ)
tags:
  - Competitive Programming
  - ICPC
date: 2022-12-13 18:40:19
categories:
  - 题解
mathjax: true
---

只把签到题做了做。

回头把剩下的题补一下

听说今年要七道题才能铜 😂

## [C - Clone Ranran](https://codeforces.com/gym/104077/problem/C)
#### 题目大意
然然要准备 $c$ 道题，它可以进行两种操作：

- 克隆一个自己，使自己的数量变为原来的二倍，这需要消耗 $a$ 分钟时间
- 每个自己准备一道题，这需要消耗 $b$ 分钟的时间

然然不可能同时做两件事，问准备 $c$ 道题目最少用时。

#### 思路

经过分析我们可以得知，先进行克隆操作总是不亏的，因为每次克隆操作都能使接下来用相同的时间
准备的题目数量增加2倍。而且我们一定是先进行完所有的克隆操作，最后再准备题目。

那么什么时候停止克隆呢。我们可以计算每次克隆+准备所有题目的用时和不克隆准备所有题目的用时，
如果大于就不再克隆了。

确定了这两点，代码就不难写了

#### 代码
```cpp
#include <bits/stdc++.h>
#define rep(NAME, MAX) for (int NAME = 0; NAME < MAX; i++)
#define rep1(NAME, MAX) for (int NAME = 1; NAME <= MAX; i++)
#define repv0(NAME, START) for (int NAME = START; NAME >= 0; NAME--)
#define repv1(NAME, START) for (int NAME = START; NAME >= 1; NAME--)

template <typename T>
typename std::enable_if<std::is_integral<T>::value>::type read(T &value) {
  value = 0;
  char ch = getchar();
  bool flag = false;
  while (!std::isdigit(ch)) {
    if (ch == '-')
      flag = true;
    ch = getchar();
  }
  while (std::isdigit(ch)) {
    value = value * 10 + (ch - '0');
    ch = getchar();
  }
  if (flag)
    value *= -1;
}

template <typename T, typename... A> void read(T &value, A &..._t) {
  read(value);
  read(_t...);
}

using ll = long long;
using ul = unsigned long long;
using ld = long double;

void solve() {
  ul a, b, c;
  read(a, b, c);

  ul ranran = 1;
  ul time = 0;
  while (std::ceil(1.0 * c / ranran) * b >
         a + std::ceil(1.0 * c / (ranran * 2)) * b) {
    ranran *= 2;
    time += a;
  }
  time += std::ceil(1.0 * c/ranran) * b ;

  std::cout << time << "\n";
}

int main() {
  int t;
  read(t);
  rep(i, t) solve();
  return 0;
}

```

## [F - Hotel](https://vjudge.net/problem/Gym-104077F/origin)

### 题目大意

有 n 个队伍，每个队伍有3名成员，把他们安置在宾馆中。宾馆有单人间和双人间两种，
要求性别不同的人不能同住一间双人间，不同队伍的 人也不能同住一间双人间。

单人间的花费为 $c_1$，双人间的花费为 $c_2$ ，问安置所有的队伍最小花费多少钱。


### 思路

按照性别数量贪就行了

- 三个人性别都不一样，答案是 $min(3 * c_1, 3* c_2)$
- 两个人性别一样，答案是 $min\{3*c_1, c_2 + c_1\}$
- 三个人性别一样，答案是 $min\{3*c_1, c_2 + c_1\}$

### 代码

```cpp
#include <bits/stdc++.h>

#define rep(NAME, MAX) for (int NAME = 0; NAME < MAX; i++)
#define rep1(NAME, MAX) for (int NAME = 1; NAME <= MAX; i++)
#define repv0(NAME, START) for (int NAME = START; NAME >= 0; NAME--)
#define repv1(NAME, START) for (int NAME = START; NAME >= 1; NAME--)

using ll = long long;
using ul = unsigned long long;
using ld = long double;


int main() {
#ifdef ONLINE_JUDGE
  std::ios::sync_with_stdio(false);
  std::cin.tie(nullptr);
  std::cout.tie(nullptr);
#endif
  int numOfTeam, cost1, cost2;
  std::cin >> numOfTeam >> cost1 >> cost2;
  ll totalCost = 0;
  std::string team;
  std::getline(std::cin, team);
  rep(i, numOfTeam) {
    std::getline(std::cin, team);
    std::set<char> set(team.begin(), team.end());
    if (set.size() == 3) {
      totalCost += std::min(3 * cost1, 3 * cost2);
    } else if (set.size() == 2) {
      totalCost += std::min(
          3 * cost1, std::min(cost1 + cost2, std::min(2 * cost1 + cost2, 2 *cost2)));
    } else if (set.size() == 1) {
      totalCost += std::min(3 * cost1, std::min(2 * cost2, cost1 + cost2));
    }
  }
  std::cout << totalCost << "\n";

  return 0;
}
```

## [G - Prefect Word](https://codeforces.com/gym/104077/problem/G) 递推

#### 题目大意

给予 $n$ 个字符串，在里面找到 prefect 字符串，它的所有非空字字符串在给的字符串中都出现过。输出这个 prefect 字符串
的长度。

#### 思路

首先可以确定，如果所有的字符串的长度都是1，答案是1。

若字符串$s$长度为2，$s[0:0]$和$s[1:1]$一定在所有给的字符串中出现过

若字符串长度为3，它的$s[0:0]$，$s[1:1]$，$s[2:2]$,$s[0:1]$，$s[1:2]$一定也出现过，但是由于我们之前判断过$s[0:1]$合法，因此我们现在只需要判断$s[1:2]$合发法即可（$s[1:2]$如果合法，也包含了$s[2:2]$出现过）。

继续，若字符串长度为$4$，由于我们之前判断了 $s[0,2]$合法，因此现在我们只需要判断$s[1:3]$合法即可。

一旦所有长度为$t$的字符串判断失败时，答案即为$t-1$


#### 代码

```cpp
#include<bits/stdc++.h>

#define rep(NAME, MAX) for(int NAME = 0; NAME < MAX; i++)
#define rep1(NAME, MAX) for(int NAME = 1; NAME <= MAX; i++)
#define repv0(NAME, START) for(int NAME = START; NAME >= 0; NAME--)
#define repv1(NAME, START) for(int NAME = START; NAME >= 1; NAME--)

using ll = long long;
using ul = unsigned long long;
using ld = long double;

// ------------ Minify with Regex "^\s*(?!#)(.*)\n" -> "$1 " ------------
template <class A, class B> std::ostream &operator<<(std::ostream &s, std::pair<A, B> const &a) { return s << "(" << std::get<0>(a) << ", " << std::get<1>(a) << ")"; } template <size_t n, typename... T> typename std::enable_if<(n >= sizeof...(T))>::type print_tuple(std::ostream &, const std::tuple<T...> &) {} template <size_t n, typename... T> typename std::enable_if<(n < sizeof...(T))>::type print_tuple(std::ostream &os, const std::tuple<T...> &tup) { if (n != 0) os << ", "; os << std::get<n>(tup); print_tuple<n + 1>(os, tup); } template <typename... T> std::ostream &operator<<(std::ostream &os, const std::tuple<T...> &tup) { os << "("; print_tuple<0>(os, tup); return os << ")"; } template <class T> std::ostream &print_collection(std::ostream &s, T const &a) { s << '['; for (auto it = std::begin(a); it != std::end(a); ++it) { s << *it; if (it != std::prev(end(a))) s << ", "; } return s << ']'; } template <class T, class U> std::ostream &operator<<(std::ostream &s, std::map<T, U> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::set<T> const &a) { return print_collection(s, a); } template <class T> std::ostream &operator<<(std::ostream &s, std::vector<T> const &a) { return print_collection(s, a); } void __debug_out() { std::cerr << std::endl; } template <typename T, class = typename std::enable_if<std::is_pointer<T>::value>::type> void __debug_out(T beg, T end) { std::cerr << '['; for (auto it = beg; it != end; it++) { std::cerr << *it; if (it != std::prev(end)) { std::cerr << ", "; } } std::cerr << ']' << std::endl; } template <typename H, typename... Tail> void __debug_out(H h, Tail... T) { std::cerr << " " << h; __debug_out(T...); }
#ifndef ONLINE_JUDGE
#define debug(...) std::cerr << "[" << #__VA_ARGS__ << "]:", __debug_out(__VA_ARGS__)
#else
#define debug(...) do {} while (0)
#endif
// Codes Below

int main(){
  #ifdef ONLINE_JUDGE
    std::ios::sync_with_stdio(false);
  std::cin.tie(nullptr);
  std::cout.tie(nullptr);
  #endif
  ll n;
  std::cin >> n;
  std::vector<std::string> words(n);
  ll maxlen = 0;
  rep(i, n) {
    std::cin >> words[i];
    maxlen = std::max(ll(words[i].size()), maxlen);
  }

  if(maxlen == 1){
    std::cout << 1;
    return 0;
  }

  std::sort(words.begin(), words.end(), [](const std::string &l, const std::string& r){
    return l.size() < r.size();
  });

  ll len = 1;
  for(auto iter = words.begin(); iter != words.end(); iter++){
    if(iter->size() - len > 1){
      // after is impossible
      words.erase(iter, words.end());
      break;
    }else{
      len = iter->size();
    }
  }

  std::set<std::string> exists;
  len = 0;
  rep(i, words.size()){
    if(words[i].size() == 1){
      exists.insert(words[i]);
      len = std::max(len, ll(words[i].size()));
    }else if(exists.count(words[i].substr(0, words[i].size()-1)) && exists.count(words[i].substr(1, words[i].size() - 1)) ){
      exists.insert(words[i]);
      len = std::max(len, ll(words[i].size()));
    }
  }
  std::cout << len;
    return 0;
}
```


# J - Strange Sum

```cpp
#include<bits/stdc++.h>
#define rep(NAME, MAX) for(decltype(MAX) NAME = 0; NAME < MAX; i++)
#define rep1(NAME, MAX) for(decltype(MAX) NAME = 1; NAME <= MAX; i++)
#define repv0(NAME, START) for(decltype(START) NAME = START; NAME >= 0; NAME--)
#define repv1(NAME, START) for(decltype(START) NAME = START; NAME >= 1; NAME--)
template <typename T>
typename std::enable_if<std::is_integral<T>::value>::type read(T &value) {
  value = 0;
  char ch = getchar();
  bool flag = false;
  while (!std::isdigit(ch)) {
    if (ch == '-')
      flag = true;
    ch = getchar();
  }
  while (std::isdigit(ch)) {
    value = value * 10 + (ch - '0');
    ch = getchar();
  }
  if (flag)
    value *= -1;
}

template <typename T, typename... A> void read(T &value, A &..._t) {
  read(value);
  read(_t...);
}
using ll = long long;
using ul = unsigned long long;
using ld = long double;

int main(){
  ll n;
  read(n);
  std::vector<ll> seq(n);
  rep(i, n) read(seq[i]);
  std::sort(seq.begin(), seq.end());
  std::cout << std::max(0LL, std::max(seq[n-1], n >= 2? seq[n-1] + seq[n-2]: 0LL));
	return 0;
}
```
