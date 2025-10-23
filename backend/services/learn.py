# Python学习练习题目
# 题目：创建一个简单的学生管理系统

"""
练习要求：
1. 创建一个Student类，包含以下属性：
   - name (姓名)
   - age (年龄)
   - grade (年级)
   - subjects (科目列表)

2. 创建以下方法：
   - __init__(): 初始化学生信息
   - add_subject(): 添加科目
   - get_info(): 返回学生信息
   - calculate_average(): 计算平均分（假设每个科目都有分数）

3. 创建一个函数：
   - create_student(): 用于创建学生对象
   - display_students(): 显示所有学生信息

示例：
student1 = create_student("张三", 18, "高三")
student1.add_subject("数学", 85)
student1.add_subject("英语", 90)
print(student1.get_info())
print(f"平均分: {student1.calculate_average()}")

请按照上面的要求完成代码，我会检查你的实现！
"""

# 请在这里写你的代码：

# ========== 列表推导式练习题目 ==========
"""
练习要求：
1. 使用列表推导式完成以下任务
2. 每个任务都要用传统循环和列表推导式两种方法实现
3. 对比两种写法的差异

数据准备：
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
students = [
    {'name': '张三', 'age': 18, 'score': 85},
    {'name': '李四', 'age': 17, 'score': 92},
    {'name': '王五', 'age': 19, 'score': 78},
    {'name': '赵六', 'age': 18, 'score': 88}
]
"""

# 数据
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
students = [
    {'name': '张三', 'age': 18, 'score': 85},
    {'name': '李四', 'age': 17, 'score': 92},
    {'name': '王五', 'age': 19, 'score': 78},
    {'name': '赵六', 'age': 18, 'score': 88}
]

print("=== 列表推导式练习 ===\n")

# 题目1：提取所有偶数
print("题目1：从numbers中提取所有偶数")
print("原始数据:", numbers)

# 传统方法
evens_traditional = []
for num in numbers:
    if num % 2 == 0:
        evens_traditional.append(num)
print("传统方法:", evens_traditional)

# 列表推导式方法（请在这里写）
# evens_comprehension = [??? for ??? in ??? if ???]
# print("列表推导式:", evens_comprehension)

print("\n" + "="*50 + "\n")

# 题目2：提取所有学生姓名
print("题目2：从students中提取所有学生姓名")
print("原始数据:", students)

# 传统方法
names_traditional = []
for student in students:
    names_traditional.append(student['name'])
print("传统方法:", names_traditional)

# 列表推导式方法（请在这里写）
# names_comprehension = [??? for ??? in ???]
# print("列表推导式:", names_comprehension)

print("\n" + "="*50 + "\n")

# 题目3：提取分数大于80的学生姓名
print("题目3：提取分数大于80的学生姓名")

# 传统方法
high_scorers_traditional = []
for student in students:
    if student['score'] > 80:
        high_scorers_traditional.append(student['name'])
print("传统方法:", high_scorers_traditional)

# 列表推导式方法（请在这里写）
# high_scorers_comprehension = [??? for ??? in ??? if ???]
# print("列表推导式:", high_scorers_comprehension)

print("\n" + "="*50 + "\n")

# 题目4：将每个数字平方
print("题目4：将numbers中每个数字平方")

# 传统方法
squares_traditional = []
for num in numbers:
    squares_traditional.append(num * num)
print("传统方法:", squares_traditional)

# 列表推导式方法（请在这里写）
# squares_comprehension = [??? for ??? in ???]
# print("列表推导式:", squares_comprehension)

print("\n" + "="*50 + "\n")

# 题目5：提取所有学生的年龄，但只保留偶数年龄
print("题目5：提取所有学生的年龄，但只保留偶数年龄")

# 传统方法
even_ages_traditional = []
for student in students:
    if student['age'] % 2 == 0:
        even_ages_traditional.append(student['age'])
print("传统方法:", even_ages_traditional)

# 列表推导式方法（请在这里写）
# even_ages_comprehension = [??? for ??? in ??? if ???]
# print("列表推导式:", even_ages_comprehension)

print("\n" + "="*50 + "\n")

# 请完成上面的列表推导式练习！

class Student:
    def __init__(self, name, age, grade):
        self.name = name
        self.age = age
        self.grade = grade
        self.subjects = []  # 初始化为空列表
    
    def add_subject(self, subject, score):
        self.subjects.append({"subject": subject, "score": score})
    
    def get_info(self):
        return f"姓名: {self.name}, 年龄: {self.age}, 年级: {self.grade}, 科目: {self.subjects}"
    
    def calculate_average(self):
        # 计算平均分的方法
        if not self.subjects:  # 如果没有科目，返回0
            return 0
        
        # 方法1：使用循环求和（你之前写的）
        # total = 0
        # for subject_info in self.subjects:
        #     total += subject_info["score"]
        
        # 方法2：使用内置sum()函数（更简洁！）
        total = sum(subject["score"] for subject in self.subjects)
        
        # 计算平均值
        average = total / len(self.subjects)
        return average

# 创建学生的函数
def create_student(name, age, grade):
    return Student(name, age, grade)

# 显示学生信息的函数
def display_students(students):
    for student in students:
        print(student.get_info())
        if student.subjects:  # 如果有科目，显示平均分
            print(f"平均分: {student.calculate_average():.2f}")
        print("-" * 30)

# 测试代码
if __name__ == "__main__":
    # 创建学生
    student1 = create_student("张三", 18, "高三")
    student1.add_subject("数学", 85)
    student1.add_subject("英语", 90)
    student1.add_subject("物理", 78)
    
    student2 = create_student("李四", 17, "高二")
    student2.add_subject("数学", 92)
    student2.add_subject("英语", 88)
    
    # 显示学生信息
    students = [student1, student2]
    display_students(students)
