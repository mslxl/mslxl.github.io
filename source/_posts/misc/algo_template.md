---
title: 数据结构模板?
date: 2022-1-22
abbrlink: 114514
---

### 树状数组

```cpp

#include <cassert>
#include <cstdio>
#include <cstdlib>
#include <cstring>

/**
 * 用树状数组维护的前缀和数组
 * 单点修改，区间查询
 * */
class BITPrefixSum {

public:
  std::size_t real_size;
  int *data = nullptr;
  static std::size_t parent_node(std::size_t idx) { return idx + lowbit(idx); }

  BITPrefixSum(std::size_t arr_size) {
    real_size = arr_size + 1;
    data = new int[real_size];
    std::memset(data, 0, sizeof(int) * real_size);
  }
  BITPrefixSum(int *begin, int *end) : BITPrefixSum(end - begin) {
    build_from(begin, end);
  }

  void build_from(int *begin, int *end) {
    clear();
    for (int idx = 0; begin != end; begin++, idx++) {
      add(idx, *begin);
    }
  }

  void destroy() { delete[] data; }
  void clear() { std::memset(data, 0, sizeof(int) * real_size); }

  static std::size_t lowbit(std::size_t idx) { return idx & -idx; }

  std::size_t size() const { return real_size - 1; }

  void add(std::size_t idx, int value) {
    if (value == 0) {
      return;
    }
    idx++; // 向右偏移一位，让下标为 0 时能正常计算
    for (; idx < real_size; idx = parent_node(idx)) {
      data[idx] += value;
    }
  }
  void set(std::size_t idx, int value) {
    int diff = value - ask(idx);
    add(idx, diff);
  }

  int ask_prefix_sum(std::size_t idx) const {
    idx++; // 向右偏移一位，让下标为 0 时能正常计算
    int ans = 0;
    for (; idx; idx -= lowbit(idx)) {
      ans += data[idx];
    }
    return ans;
  }
  int ask(std::size_t idx) const {
    return ask_prefix_sum(idx) - ask_prefix_sum(idx - 1);
  }

  int ask_period(std::size_t left, std::size_t right) const {
    return ask_prefix_sum(right) - ask_prefix_sum(left - 1);
  }
};

/**
 * 用树状数组的前缀和维护的差分数组
 * 区间修改，区间(单点)查询
 * */
class BITDifference {

protected:
  BITPrefixSum *data;
  BITPrefixSum *data_mul_i;

  void internal_add(std::size_t idx, int value) {
    data->add(idx, value);
    data_mul_i->add(idx, value * (idx + 1));
  }

public:
  BITDifference(std::size_t arr_size) {
    data = new BITPrefixSum(arr_size);
    data_mul_i = new BITPrefixSum(arr_size);
  }

  BITDifference(int *begin, int *end) : BITDifference(end - begin) {
    build_from(begin, end);
  }

  void build_from(int *begin, int *end) {
    clear();
    internal_add(0, *begin);
    begin++;
    for (int idx = 1; begin != end; begin++, idx++) {
      internal_add(idx, *begin - *(begin - 1));
    }
  }

  void destroy() {
    data->destroy();
    data_mul_i->destroy();
    delete data;
    delete data_mul_i;
  }
  void clear() {
    data->clear();
    data_mul_i->clear();
  }

  std::size_t size() const { return data->size(); }

  int ask(std::size_t idx) const { return data->ask_prefix_sum(idx); }

  void add_interval(std::size_t left, std::size_t right, int value) {
    internal_add(left, value);
    internal_add(right + 1, -value);
  }

  int ask_prefix_sum(std::size_t idx) {
    return (idx + 2) * data->ask_prefix_sum(idx) -
           data_mul_i->ask_prefix_sum(idx);
  }

  int ask_interval(std::size_t left, std::size_t right) {
    return ask_prefix_sum(right) - ask_prefix_sum(left - 1);
  }

  void add(std::size_t idx, int value) { add_interval(idx, idx, value); }
};

int main() {
  { // 基础测试
    BITPrefixSum b(32);
    b.add(3, 1);
    b.add(4, 2);
    b.add(31, 5);
    assert(b.ask_prefix_sum(2) == 0);
    assert(b.ask_period(3, 4) == 3);
    assert(b.ask_period(0, 31) == 8);
    assert(b.ask_prefix_sum(5) == 3);
    assert(b.ask_prefix_sum(4) == 3);
    b.destroy();
  }
  {
    // data from P3374
    BITPrefixSum b(6);
    int arr[] = {0, 1, 5, 4, 2, 3};
    b.build_from(arr, arr + 6);
    b.add(1, 3);
    assert(b.ask_period(2, 5) == 14);
    b.add(3, -1);
    b.add(4, 2);
    assert(b.ask_period(1, 4) == 16);
    b.destroy();
  }

  { // 差分数组基础测试
    BITDifference b(32);
    b.add_interval(0, 10, 2);
    b.add_interval(5, 9, 2);
    assert(b.ask(10) == 2);
    assert(b.ask(5) == 4);
    assert(b.ask(4) == 2);
    assert(b.ask(10) == 2);

    b.clear();
    int arr[] = {1, 2, 3, 4, 5, 6, 7};
    b.build_from(arr, arr + 7);
    for (int i = 0; i < 7; i++) {
      assert(b.ask(i) == i + 1);
    }
    b.add_interval(0, 3, 10);
    for (int i = 0; i <= 3; i++) {
      assert(b.ask(i) == (i + 1) + 10);
    }
    for (int i = 4; i < 7; i++) {
      assert(b.ask(i) == (i + 1));
    }
    b.destroy();
  }
  { // data from P3368
    BITDifference b(6);
    int arr[] = {0, 1, 5, 4, 2, 3};
    b.build_from(arr, arr + 6);
    assert(b.ask(4) == 2);
    assert(b.ask(5) == 3);
    b.add_interval(2, 4, 2);
    assert(b.ask(3) == 6);
    b.add_interval(1, 5, -1);
    b.add_interval(3, 5, 7);
    assert(b.ask(4) == 10);
  }

  { // 区间修改，区间查询
    BITDifference b(11);

    b.add_interval(0, 10, 10);
    assert(b.ask(5) == 10);
    assert(b.ask(0) == 10);
    assert(b.ask_prefix_sum(0) == 10);
    assert(b.ask_prefix_sum(1) == 20);
    b.add_interval(2, 5, -10);
    assert(b.ask_prefix_sum(2) == 20);
    assert(b.ask_interval(0, 5) == 20);
  }

  printf("Test passed!\n");
}

```

### 线段树

```cpp
#include <cassert>
#include <cstdlib>
#include <iostream>
/**
 * 动态开点线段树
 * */

template <typename RangeType = int, typename ValueType = int> class SegTree {
public:
  class Node {
  private:
    Node *ptr_left_node = nullptr;
    Node *ptr_right_node = nullptr;

    constexpr RangeType mid() {
      return this->left + (this->right - this->left) / 2;
    }
    constexpr RangeType interval_size() { return this->right - this->left + 1; }

    ValueType lazy_add = 0, lazy_multiply = 1;

  public:
    ValueType left, right;
    ValueType value;
    Node(RangeType l, RangeType r, ValueType v = 0)
        : left(l), right(r), value(v){};

    Node &left_node() {
      if (ptr_left_node == nullptr) {
        ptr_left_node = new Node(left, mid());
      }
      return *ptr_left_node;
    }

    Node &right_node() {
      if (ptr_right_node == nullptr) {
        ptr_right_node = new Node(mid() + 1, right);
      }
      return *ptr_right_node;
    }

    void pull_up() { this->value = left_node().value + right_node().value; }
    void push_down() {
      Node &ln = left_node();
      Node &rn = right_node();
      ln.value =
          ln.value * this->lazy_multiply + this->lazy_add * ln.interval_size();
      ln.lazy_multiply = ln.lazy_multiply * this->lazy_multiply;
      ln.lazy_add = ln.lazy_add * this->lazy_multiply + this->lazy_add;

      rn.value =
          rn.value * this->lazy_multiply + this->lazy_add * rn.interval_size();
      rn.lazy_multiply = rn.lazy_multiply * this->lazy_multiply;
      rn.lazy_add = rn.lazy_add * this->lazy_multiply + this->lazy_add;
      this->lazy_multiply = 1;
      this->lazy_add = 0;
    }

    void multiply_interval(RangeType start, RangeType end, ValueType value) {
      if (right < start || end < left)
        return;
      if (start <= left && right <= end) {
        this->value = this->value * value;
        this->lazy_multiply = this->lazy_multiply * value;
        this->lazy_add = this->value * value;
      } else {
        push_down();
        left_node().multiply_interval(start, end, value);
        right_node().multiply_interval(start, end, value);
        this->pull_up();
      }
    }

    void add_interval(RangeType start, RangeType end, ValueType value) {
      if (right < start || end < left)
        return;
      if (start <= left && right <= end) {
        this->lazy_add += value;
        this->value += value * interval_size();
      } else {
        push_down();
        left_node().add_interval(start, end, value);
        right_node().add_interval(start, end, value);
        this->pull_up();
      }
    }
    ValueType ask_interval(RangeType start, RangeType end) {
      if (right < start || end < left)
        return 0;

      if (start <= left && right <= end) {
        return this->value;
      } else {
        push_down();
        return left_node().ask_interval(start, end) +
               right_node().ask_interval(start, end);
      }
    }

    void desktroy() {
      if (ptr_left_node != nullptr) {
        ptr_left_node->desktroy();
        delete ptr_left_node;
        ptr_left_node = nullptr;
      }
      if (ptr_right_node != nullptr) {
        ptr_right_node->desktroy();
        delete ptr_right_node;
        ptr_right_node = nullptr;
      }
    }
    void build_from(ValueType *begin, ValueType *end) {
      if (right <= left) {
        this->value = *begin;
        return;
      }
      int mid_offset = (end - begin) / 2;
      left_node().build_from(begin, begin + mid_offset);
      right_node().build_from(begin + mid_offset + 1, end);
      this->pull_up();
    }
  };

  // ------ Wrapper --------
  SegTree(RangeType left, RangeType right) { root = new Node(left, right); }
  SegTree(ValueType *begin, ValueType *end, int offset = 0)
      : SegTree(offset, offset + end - begin - 1) {
    root->build_from(begin, end - 1);
  }

  void add_interval(RangeType start, RangeType end, ValueType value) {
    root->add_interval(start, end, value);
  }
  void multiply_interval(RangeType start, RangeType end, ValueType value) {
    root->multiply_interval(start, end, value);
  }
  ValueType ask_interval(RangeType start, RangeType end) {
    return root->ask_interval(start, end);
  }
  void destroy() { root->desktroy(); }
  void clear() { this->destroy(); }

private:
  Node *root;
};

int main() {
  { // Basic add test
    SegTree<int, int> st(1, 50);
    st.add_interval(1, 50, 1);
    assert(st.ask_interval(1, 50) == 50);
    st.add_interval(20, 40, -1);
    assert(st.ask_interval(1, 10) == 10);
    assert(st.ask_interval(20, 40) == 0);
    st.destroy();
  }
  { // Build from array
    int arr[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    SegTree<int, int> st(arr, arr + 10, 1);
    for (int i = 1; i <= 10; i++) {
      assert(st.ask_interval(i, i) == i);
    }
  }
  { // Multiply
    SegTree<int, int> st(1, 50);
    st.multiply_interval(1, 50, 0);
    assert(st.ask_interval(1, 50) == 0);
    assert(st.ask_interval(1, 7) == 0);
    assert(st.ask_interval(40, 40) == 0);

    st.multiply_interval(1, 50, 50);
    assert(st.ask_interval(1, 50) == 0);
    assert(st.ask_interval(1, 7) == 0);
    assert(st.ask_interval(40, 40) == 0);

    st.add_interval(1, 50, 1);
    assert(st.ask_interval(1, 50) == 50);

    st.multiply_interval(1, 1, 50);
    assert(st.ask_interval(30, 30) == 1);
    assert(st.ask_interval(1, 1) == 50);
    assert(st.ask_interval(1, 10) == 59);

    st.multiply_interval(2, 5, 50);
    assert(st.ask_interval(1, 5) == 250);
  }

  std::cout << "Test passed!" << std::endl;
  return 0;
}

```
