---
title: "LeetCode 周赛 359"
pubDate: 2023-08-21
categories:
  - Competitive Programming
  - LeetCode
---

## A. 判别首字母缩略词

> 给你一个字符串数组 words 和一个字符串 s ，请你判断 s 是不是 words 的 首字母缩略词 。
>
> 如果可以按顺序串联 words 中每个字符串的第一个字符形成字符串 s ，则认为 s 是 words 的首字母缩略词。
> 例如，"ab" 可以由 ["apple", "banana"] 形成，但是无法从 ["bear", "aardvark"] 形成。
>
> 如果 s 是 words 的首字母缩略词，返回 true ；否则，返回 false 。

`模拟`

```cpp
class Solution {
public:
    bool isAcronym(vector<string>& words, string s) {
        std::string ans;
        for(auto s: words) ans += s[0];
        return ans == s;
    }
};
```

## B. k-avoiding 数组的最小总和

> 给你两个整数 `n` 和 `k` 。
>
> 对于一个由 **不同** 正整数组成的数组，如果其中不存在任何求和等于 k 的不同元素对，则称其为 **k-avoiding** 数组。
>
> 返回长度为 `n` 的 **k-avoiding** 数组的可能的最小总和。

`贪心`

贪心，向集合中放尽可能少的数。

从小到大考虑数字 $i$ ，如果 $k-i$ 存在于集合中，则说明数字 $i$ 不可选。

```cpp
class Solution {
 public:
  int minimumSum(int n, int k) {
    std::set<int> sum;
    for (int i = 1; sum.size() < n; i++) {
      if (i >= k) {
        sum.insert(i);
      } else {
        if (sum.count(k - i)) {
          continue;
        }
        sum.insert(i);
      }
    }

    int ansSum = 0;
    for (auto i : sum) {
      ansSum += i;
    }
    return ansSum;
  }
};
```

## C. 销售利润最大化

> 给你一个整数 `n` 表示数轴上的房屋数量，编号从 `0` 到 `n - 1` 。
>
> 另给你一个二维整数数组 `offers` ，其中 `offers[i] = [starti, endi, goldi]` 表示第 `i` 个买家想要以
>  `goldi` 枚金币的价格购买从 `starti` 到 `endi` 的所有房屋。
>
> 作为一名销售，你需要有策略地选择并销售房屋使自己的收入最大化。
>
> 返回你可以赚取的金币的最大数目。
>
> **注意** 同一所房屋不能卖给不同的买家，并且允许保留一些房屋不进行出售。

`线性 DP`

枚举 end 状态，设当前状态为 $i$

- $dp[i] = dp[i-1]$ 不买这个位置的房

- $dp[i] = dp[u-1] + w$ 买这段上的房

由于题目都是从 `0` 开始，减1容易越界，因此可以将 start 和 end 加一。答案取 max 即可

```cpp
class Solution {
 public:
  int maximizeTheProfit(int n, vector<vector<int>>& offers) {
    std::map<int, std::vector<std::pair<int, int>>> mp;
    for (auto& item : offers) {
      mp[item[1] + 1].push_back({item[0] + 1, item[2]});
    }
    std::vector<int> dp(n + 1);
    for (int i = 1; i <= n; i++) {
      dp[i] = dp[i - 1];
      for (auto& [u, w] : mp[i]) {
        dp[i] = std::max(dp[i], dp[u - 1] + w);
      }
    }
    return dp[n];
  }
};

```

## 找出最长等值子数组

> 给你一个下标从 **0** 开始的整数数组 `nums` 和一个整数 `k` 。
>
> 如果子数组中所有元素都相等，则认为子数组是一个 **等值子数组** 。注意，空数组是 **等值子数组** 。
>
> 从 `nums` 中删除最多 `k` 个元素后，返回可能的最长等值子数组的长度。
>
> **子数组** 是数组中一个连续且可能为空的元素序列。

`分组` `双指针`

题目要求从一段子区间中删除不大于 $k$ 个数，使得子区间中剩余的数字相同

选择子区间中相同的数比较麻烦，我们可以直接将相同的数分为一组，将下标保存在数组中。

剩下的问题就是在所有组中找到一个区间，他们的下标中相隔的数字的数量不超过$k$。可以使用前缀和，
区间$[l,r]$中需要删除的数字数量为 $pos[r] - pos[l] + (r-l)$。也可以直接算 $(pos[r] - pos[l]) - (r-l)$（区间的总长度减去不需要删除的数字数量）

写写 GO 玩玩

```go
func longestEqualSubarray(nums []int, k int) int {
    maxValue := 0
    for _, v := range nums {
        maxValue = max(maxValue, v)
    }
    pos := make([][]int, maxValue+1)
    for i, v := range nums {
        pos[v] = append(pos[v], i)
    }

    ans := 0
    for _, ps := range pos {
        left := 0
        for right, p := range ps {
            for p-ps[left]-(right-left) > k { //删除的数字数量大于了 k
                left++
            }
            ans = max(ans, right-left+1)
        }
    }
    return ans
}

func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}

```
