use std::collections::HashMap;

impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        let mut map: HashMap<i32, i32> = HashMap::new();

        for (i, num) in nums.into_iter().enumerate() {
            let comp = &(target - num);

            if map.contains_key(comp) {
                return vec![i as i32, *map.get(comp).unwrap()];
            } else {
                map.insert(num, i as i32);
            }
        }

        vec![]
    }
}
