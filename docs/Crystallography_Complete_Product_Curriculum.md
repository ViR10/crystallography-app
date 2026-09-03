# Crystallography — Complete Product & Curriculum Specification

**Project:** Crystallography  
**Purpose:** Interactive learning, visualization, practice, and mastery platform for BS Materials / Metallurgical Engineering students.

---

# 1. Product Vision

Crystallography is an interactive educational tool designed to help BS students **understand, visualize, practice, and master crystallographic concepts**, beginning with:

- Crystal fundamentals
- Unit cells
- Simple Cubic (SC)
- Coordinate systems
- Miller Indices
- Crystal Planes
- Plane families
- Guided problem solving
- 3D visualization
- Adaptive practice
- Exam preparation
- Mastery tracking

The first release should focus deeply on **Simple Cubic + Miller Indices + Crystal Planes**.

The product should not behave like a static textbook or calculator.

The learning loop is:

> **Learn → See → Interact → Solve with guidance → Solve independently → Analyze mistakes → Practice weak areas → Test → Master**

---

# 2. Recommended Total Pages

## MVP — 17 Main Pages

| # | Page | Purpose |
|---|---|---|
| 01 | Landing / Welcome | Introduce the platform |
| 02 | Dashboard | Student home and progress |
| 03 | Fundamentals | Build crystallography foundation |
| 04 | Fundamentals Lesson | Teach individual foundational concepts |
| 05 | Miller Indices Learn | Complete Miller Indices curriculum |
| 06 | Miller Indices Visualizer | Interactive 3D sandbox |
| 07 | Miller Guided Practice | Step-by-step learning practice |
| 08 | Miller Practice | Independent question bank |
| 09 | Miller Challenge | Advanced reasoning |
| 10 | Crystal Planes Learn | Complete crystal-plane curriculum |
| 11 | Crystal Plane Explorer | Interactive plane visualization |
| 12 | Plane Guided Practice | Step-by-step plane practice |
| 13 | Plane Practice | Independent plane practice |
| 14 | Plane Challenge / Comparison Lab | Advanced plane reasoning |
| 15 | Exam Mode | Timed assessment |
| 16 | Results / Mistake Analysis | Detailed performance analysis |
| 17 | Mastery / Progress | Long-term learning progress |

### Optional future pages

- Directions
- BCC
- FCC
- HCP
- Crystal systems
- Planar density
- Linear density
- Interplanar spacing
- XRD
- Bravais lattices
- Achievement / certificates
- Student profile
- Instructor / teacher dashboard

---

# 3. Global Navigation

The primary navigation should be:

```text
CRYSTALLOGRAPHY

Home
Learn
   ├── Fundamentals
   ├── Miller Indices
   └── Crystal Planes

Explore
   ├── 3D Crystal Explorer
   ├── Miller Visualizer
   └── Plane Explorer

Practice
   ├── Miller Indices
   ├── Crystal Planes
   └── Mixed Practice

Exam
   └── Exam Mode

Progress
   └── Mastery
```

A student should always know:

1. What am I learning?
2. What should I do next?
3. How well am I doing?
4. What am I weak at?

---

# 4. PAGE 01 — Landing / Welcome

## Goal

Explain the product in a simple way and immediately communicate that this is an **interactive 3D learning platform**.

## Hero Section

Title:

> **Master Crystallography Visually**

Subtitle:

> Learn Miller Indices and Crystal Planes through interactive 3D visualization, guided practice, and mastery-based learning.

Primary CTA:

> **Start Learning**

Secondary CTA:

> **Explore 3D Crystal**

## Hero Visual

Large interactive Simple Cubic unit cell.

Show:

- Atoms
- x/y/z axes
- Grid
- One highlighted plane
- Rotation

## Feature Cards

### Learn

Understand concepts step by step.

### Visualize

See planes and indices in 3D.

### Practice

Solve progressively difficult problems.

### Master

Track weaknesses and improve.

## Curriculum Preview

```text
Fundamentals
      ↓
Miller Indices
      ↓
Crystal Planes
      ↓
Practice
      ↓
Exam
      ↓
Mastery
```

---

# 5. PAGE 02 — Dashboard

## Goal

Student's central home page.

## Header

```text
Welcome back!

Continue your crystallography journey.
```

## Overall Progress

```text
Overall Mastery

82%

████████████████░░░░
```

## Learning Modules

### Fundamentals

```text
Progress: 100%
Status: Completed
```

### Miller Indices

```text
Progress: 78%
Status: In Progress
Continue →
```

### Crystal Planes

```text
Progress: 54%
Status: In Progress
Continue →
```

## Skill Breakdown

```text
Concept Understanding       91%
Intercept Identification    86%
Reciprocal Calculation      88%
Negative Indices            61%
3D Plane Recognition        72%
Plane Families              58%
Problem Solving             76%
Exam Readiness              64%
```

## Recommended Next Practice

Example:

> **Weak Area Detected**
>
> Plane Families — 58%
>
> Practice 8 targeted questions.
>
> **Practice Now →**

## Recent Activity

```text
✓ Completed: Intercepts
✓ Scored 90%: Basic Miller Practice
✓ Learned: (110) Plane
```

---

# 6. PAGE 03 — Fundamentals

## Goal

Build the minimum conceptual foundation required before Miller Indices.

## Module Structure

### Module 1 — What is Crystallography?

Teach:

- What is a crystal?
- Atomic arrangement
- Crystal lattice
- Periodicity
- Why crystallography matters in Materials Engineering

### Module 2 — Crystal Lattice

Teach:

- Lattice points
- Unit cell
- Repeating structure
- Translation

### Module 3 — Unit Cell

Teach:

- Definition
- Unit-cell dimensions
- Axes
- Origin
- Coordinates

### Module 4 — Simple Cubic

Teach:

- SC geometry
- Corner atoms
- Unit-cell structure
- Coordination number
- Atomic packing factor as an introductory concept

### Module 5 — Coordinate System

Teach:

- x-axis
- y-axis
- z-axis
- Positive directions
- Negative directions
- Fractional coordinates

## Visual Area

Always show a rotatable SC unit cell.

Controls:

```text
Rotate
Zoom
Reset
Show Atoms
Show Axes
Show Coordinates
Show Grid
```

## Lesson Completion

At the bottom:

```text
✓ Concept understood

[Mark as Complete]

Next:
Miller Indices →
```

---

# 7. PAGE 04 — Fundamentals Lesson

This is the reusable lesson viewer.

## Layout

Desktop:

```text
┌──────────────────────────────────────────────┐
│ Lesson Title                       3/5       │
├───────────────┬──────────────────────────────┤
│ Lesson Menu   │                              │
│               │       Main Lesson            │
│ 1 Crystals    │                              │
│ 2 Lattice     │       Explanation            │
│ 3 Unit Cell   │                              │
│ 4 SC          │       Diagram / 3D           │
│ 5 Coordinates │                              │
│               │       Interactive Task       │
└───────────────┴──────────────────────────────┘
```

## Every Lesson Should Contain

1. Learning objective
2. Simple explanation
3. Visual/3D demonstration
4. Real Materials Engineering connection
5. Mini interaction
6. Quick check
7. Summary
8. Continue button

## Example Quick Check

> Which axis is perpendicular to both x and y?

Student answers.

Immediate feedback.

---

# 8. PAGE 05 — Miller Indices Learn

This is one of the most important pages.

## Curriculum

### Lesson 1 — What Are Miller Indices?

Explain:

> Miller indices are a notation used to describe the orientation of crystallographic planes.

Introduce notation:

```text
(hkl)
```

Explain:

- h → x-related index
- k → y-related index
- l → z-related index

---

## Lesson 2 — Step 1: Find Intercepts

Teach:

> Determine where the plane intersects the x, y and z axes.

Example:

```text
x = 1
y = 2
z = ∞
```

Show these points in 3D.

---

## Lesson 3 — Step 2: Take Reciprocals

Example:

```text
Intercepts:

(1, 2, ∞)

Reciprocals:

(1, 1/2, 0)
```

Explain why:

```text
1/∞ = 0
```

---

## Lesson 4 — Step 3: Clear Fractions

Example:

```text
(1, 1/2, 0)

LCM = 2

× 2

(2, 1, 0)
```

Answer:

```text
(210)
```

---

## Lesson 5 — Planes Parallel to an Axis

Explain:

```text
Intercept = ∞
Reciprocal = 0
```

Examples:

```text
(100)
(010)
(001)
```

---

## Lesson 6 — Negative Indices

Teach:

```text
Intercept = -1

Reciprocal = -1

Miller index = -1
```

Notation:

```text
(\bar{1}11)
```

The UI should render the overbar properly rather than requiring students to type LaTeX.

---

## Lesson 7 — Special / Fractional Intercepts

Examples:

```text
1/2
1
∞
```

Show how to obtain integer Miller indices.

---

## Lesson 8 — Common SC Planes

Interactive examples:

```text
(100)
(010)
(001)
(110)
(101)
(011)
(111)
```

Students can click each index and see the plane.

---

## Lesson 9 — Miller Index Notation

Explain the difference:

```text
(hkl)   → specific plane
{hkl}   → family of equivalent planes
[uvw]   → specific direction
<uvw>   → family of equivalent directions
```

Directions can be introduced lightly here but fully taught later.

---

# 9. PAGE 06 — Miller Indices 3D Visualizer

## Goal

A free exploration sandbox.

## Main Layout

```text
┌────────────────────────────────────────────────────┐
│ MILLER INDICES VISUALIZER                          │
├──────────────┬──────────────────────┬──────────────┤
│ Inputs       │      3D Crystal      │ Calculations │
│              │                      │              │
│ X: [1]       │       Plane          │ Intercepts   │
│ Y: [2]       │       rendered       │      ↓       │
│ Z: [∞]       │       here           │ Reciprocals  │
│              │                      │      ↓       │
│ [Generate]   │                      │ Miller Index │
└──────────────┴──────────────────────┴──────────────┘
```

## Inputs

```text
X Intercept
Y Intercept
Z Intercept
```

## Outputs

```text
Intercepts
Reciprocals
LCM
Final Integer Ratio
Miller Indices
```

## 3D Controls

- Rotate
- Zoom
- Pan
- Reset
- Show axes
- Show intercepts
- Show plane
- Show lattice points
- Show coordinate labels
- Show grid

## Animation

Provide:

```text
Step 1 → Step 2 → Step 3 → Answer
```

The student can watch the mathematical solution transform into the 3D plane.

---

# 10. PAGE 07 — Miller Guided Practice

## Goal

Teach problem solving before independent practice.

Questions should be broken into stages.

## Stage 1 — Identify Intercepts

Show a 3D plane.

Ask:

```text
x-intercept = ?
y-intercept = ?
z-intercept = ?
```

---

## Stage 2 — Reciprocals

```text
Intercepts:

1, 2, ∞

Reciprocals:

[ ? ] [ ? ] [ ? ]
```

---

## Stage 3 — LCM

```text
(1, 1/2, 0)

LCM = ?

[ 2 ]
```

---

## Stage 4 — Final Indices

```text
( ? ? ? )
```

---

## Hint System

Hints should reveal progressively:

### Hint 1

> Look at the x-intercept first.

### Hint 2

> Miller indices use reciprocals of intercepts.

### Hint 3

> The reciprocal of infinity is zero.

### Hint 4

> Multiply by the LCM to remove fractions.

Never reveal the full answer immediately unless the student requests it.

---

# 11. PAGE 08 — Miller Independent Practice

## Goal

Students solve without scaffolding.

## Question Screen

```text
Question 7 / 20

Determine the Miller indices
of the highlighted plane.

        [3D Crystal]

Your Answer:

( [ ] [ ] [ ] )

[Submit]
```

## Difficulty

```text
Easy
Medium
Hard
```

## Topic Filters

```text
Basic Intercepts
Reciprocals
Fractional Intercepts
Parallel Axes
Negative Indices
Mixed
```

## Question Types

1. Calculate Miller indices from intercepts
2. Read intercepts from a 3D plane
3. Choose correct Miller indices
4. Match plane to index
5. Complete missing calculation
6. Identify incorrect solution

---

# 12. PAGE 09 — Miller Challenge

## Goal

Test deeper understanding.

## Challenge Types

### Reverse Problem

Give:

```text
(210)
```

Ask:

> Which plane corresponds to these Miller indices?

---

### Error Detection

Show:

```text
Intercepts:
1, 2, ∞

Student:
1, 2, 0
↓
(120)
```

Ask:

> What is wrong?

---

### Visual Reasoning

Show multiple planes.

Ask:

> Which plane is parallel to the z-axis?

---

### Speed Challenge

```text
10 Questions
90 Seconds
```

---

## Challenge Score

Track:

- Accuracy
- Time
- Hints used
- Mistakes
- Difficulty

---

# 13. PAGE 10 — Crystal Planes Learn

This is a separate learning path.

Important distinction:

> Miller Indices teach the mathematical description of plane orientation.

> Crystal Planes teach the physical and geometric meaning of those planes.

## Curriculum

### Lesson 1 — What Is a Crystal Plane?

Explain the concept using a lattice.

### Lesson 2 — Plane Orientation

Show different orientations in a unit cell.

### Lesson 3 — Relationship Between Intercepts and Planes

Connect:

```text
Plane
↓
Intercepts
↓
Reciprocals
↓
Miller Indices
```

### Lesson 4 — (100)

Explore the plane in 3D.

### Lesson 5 — (010)

Explore.

### Lesson 6 — (001)

Explore.

### Lesson 7 — (110)

Explore.

### Lesson 8 — (101)

Explore.

### Lesson 9 — (011)

Explore.

### Lesson 10 — (111)

Explore.

### Lesson 11 — Plane Families

Introduce:

```text
{100}
{110}
{111}
```

Explain:

> Braces represent a family of symmetry-equivalent planes.

### Lesson 12 — Comparing Planes

Compare:

```text
(100)
(110)
(111)
```

in the same SC cell.

---

# 14. PAGE 11 — Crystal Plane Explorer

## Goal

Free 3D exploration.

## Input

```text
Miller Indices

h [ 1 ]
k [ 1 ]
l [ 0 ]

[Show Plane]
```

## Main 3D Scene

Show:

- SC unit cell
- Atoms/lattice points
- Plane
- Axes
- Origin
- Intercepts
- Coordinates

## Information Panel

```text
Plane: (110)

x-intercept: 1
y-intercept: 1
z-intercept: ∞

Orientation:
Diagonal plane

Parallel to:
z-axis
```

## Presets

```text
(100)
(010)
(001)
(110)
(101)
(011)
(111)
```

---

# 15. PAGE 12 — Crystal Plane Guided Practice

## Goal

Teach students to recognize planes visually.

## Level 1 — Recognition

Show plane.

Ask:

> Which plane is this?

Options:

```text
(100)
(110)
(111)
```

---

## Level 2 — Axis Intersections

Ask:

> Which axes does this plane intersect?

---

## Level 3 — Parallel Axis

Ask:

> Which axis is this plane parallel to?

---

## Level 4 — Miller Indices

Student calculates:

```text
Intercepts
↓
Reciprocals
↓
Miller indices
```

---

## Level 5 — Plane Selection

Give:

```text
(111)
```

Show three 3D options.

Student selects the correct one.

---

# 16. PAGE 13 — Crystal Plane Independent Practice

## Question Types

### Type A — Identify Plane

3D → `(hkl)`

### Type B — Select Plane

`(hkl)` → correct 3D plane

### Type C — Find Intercepts

3D → intercept values

### Type D — Identify Parallel Axis

Plane → axis

### Type E — Compare

Which plane has the given orientation?

### Type F — Mixed

Combine visual and mathematical questions.

## Difficulty

```text
Beginner
Intermediate
Advanced
Expert
```

---

# 17. PAGE 14 — Plane Challenge / Comparison Lab

This should be one of the strongest educational pages.

## Plane Comparison

Allow students to select:

```text
(100)
(110)
(111)
```

Then show them simultaneously.

## Comparison Panel

| Property | (100) | (110) | (111) |
|---|---|---|---|
| x-intercept | | | |
| y-intercept | | | |
| z-intercept | | | |
| Parallel axis | | | |
| Orientation | | | |
| Miller notation | | | |

## Challenge

Ask questions such as:

> Which plane is parallel to the z-axis?

> Which plane intersects all three axes at 1?

> Which Miller index contains a zero?

> Which plane has the diagonal orientation shown?

---

# 18. PAGE 15 — Exam Mode

## Goal

Simulate university-style assessment.

## Setup

Student selects:

```text
Topic:
○ Miller Indices
○ Crystal Planes
○ Mixed

Difficulty:
○ Easy
○ Medium
○ Hard
○ Mixed

Questions:
10 / 20 / 30

Time:
10 / 20 / 30 minutes
```

## Exam Screen

```text
CRYSTALLOGRAPHY EXAM

Question 8 / 20
Time Remaining: 12:34

[3D Plane]

Determine the Miller indices.

Answer: ______

[Previous] [Next]
```

## Rules

During exam:

- No hints
- No guided solution
- Optional calculator disabled/enabled according to mode
- Question navigation
- Flag question
- Submit exam

---

# 19. PAGE 16 — Results / Mistake Analysis

After an exam or practice session.

## Score

```text
82%

16 / 20 Correct
```

## Performance

```text
Accuracy        82%
Average Time    42 sec
Hints Used      3
```

## Topic Analysis

```text
Intercepts             95% ✓
Reciprocals            90% ✓
Fractional Indices     70% ⚠
Negative Indices       55% 🔴
Plane Recognition      85% ✓
Plane Families         60% ⚠
```

## Mistake Review

For each wrong answer:

```text
Question 6

Your Answer:
(120)

Correct:
(210)

Why?

You correctly calculated the reciprocals,
but assigned the x/y values in the wrong order.

[Review 3D Problem]
[Try Again]
```

## Smart Recommendation

Example:

> You made 3 mistakes involving negative indices.

> Recommended:
>
> **Negative Miller Indices — Targeted Practice**
>
> 8 questions • ~6 minutes

---

# 20. PAGE 17 — Mastery / Progress

## Overall Mastery

```text
CRYSTALLOGRAPHY MASTERY

82%

████████████████░░░░
```

## Skill Tree

```text
Fundamentals           ✓ Mastered
       ↓
Unit Cell              ✓ Mastered
       ↓
Coordinates            ✓ Mastered
       ↓
Miller Indices         78%
       ↓
Crystal Planes         65%
       ↓
Plane Families         58%
       ↓
Exam Readiness         64%
```

## Mastery Rules

Suggested:

```text
90%+ = Mastered
80–89% = Strong
70–79% = Developing
50–69% = Needs Practice
<50% = Needs Review
```

Mastery should not depend only on one quiz.

A concept should be marked mastered only when the student demonstrates:

- Accuracy
- Repeated performance
- Low hint dependency
- Reasonable solving time
- Multiple question types

---

# 21. Core Learning Model

Every concept should follow the same educational structure:

```text
1. Explain
      ↓
2. Visualize
      ↓
3. Interact
      ↓
4. Guided Example
      ↓
5. Guided Practice
      ↓
6. Independent Practice
      ↓
7. Challenge
      ↓
8. Assessment
      ↓
9. Mistake Analysis
      ↓
10. Targeted Practice
      ↓
11. Mastery
```

This structure should be reused for both:

```text
Miller Indices
Crystal Planes
```

---

# 22. Miller Indices Learning Progression

The exact progression should be:

```text
What are Miller Indices?
        ↓
Coordinate System
        ↓
Identify Intercepts
        ↓
Understand Infinity
        ↓
Take Reciprocals
        ↓
Clear Fractions
        ↓
Convert to (hkl)
        ↓
Parallel Axes
        ↓
Negative Indices
        ↓
Fractional Intercepts
        ↓
Common SC Planes
        ↓
Visual Recognition
        ↓
Reverse Problems
        ↓
Mixed Problems
        ↓
Exam
        ↓
Mastery
```

---

# 23. Crystal Planes Learning Progression

```text
What is a Crystal Plane?
        ↓
Plane Orientation
        ↓
Crystal Axes
        ↓
Plane Intercepts
        ↓
Relationship to Miller Indices
        ↓
(100)
        ↓
(010)
        ↓
(001)
        ↓
(110)
        ↓
(101)
        ↓
(011)
        ↓
(111)
        ↓
Plane Families
        ↓
{100}
        ↓
{110}
        ↓
{111}
        ↓
Compare Planes
        ↓
Recognize 3D Planes
        ↓
Reverse Problems
        ↓
Mixed Challenge
        ↓
Exam
        ↓
Mastery
```

---

# 24. Question Engine

Questions should be generated from structured templates.

## Miller Question Templates

```text
intercepts_to_miller
plane_to_intercepts
intercepts_to_reciprocals
reciprocals_to_final_indices
identify_parallel_axis
negative_index
fractional_intercept
multiple_choice
error_detection
reverse_visual
```

## Plane Question Templates

```text
identify_plane
select_plane
identify_intercepts
identify_parallel_axis
compare_planes
plane_family
3d_visual_recognition
miller_to_plane
plane_to_miller
error_detection
```

---

# 25. Adaptive Difficulty

The system should not give random difficulty only.

Example:

If a student performs:

```text
Basic planes:        95%
Reciprocals:         92%
Negative indices:    52%
Plane families:      48%
```

The system should automatically recommend:

```text
Priority 1:
Plane Families

Priority 2:
Negative Indices
```

Then generate targeted questions.

---

# 26. Feedback System

Never use only:

```text
Correct ✓
Wrong ✗
```

Instead use:

## Correct

```text
✓ Correct!

Your intercepts are correct.
The reciprocals are correct.
After multiplying by the LCM:

(210)

Excellent work.
```

## Incorrect

```text
Not quite.

You correctly identified the intercepts.

The mistake occurred when taking reciprocals.

Remember:

1 / 2 = 1/2
```

Then:

```text
[Try Again]
[Show Hint]
[See Full Solution]
```

---

# 27. 3D Visualization Requirements

The 3D system is central to the product.

## Crystal

- Simple Cubic unit cell
- Corner atoms/lattice points
- Optional grid
- Coordinate axes

## Plane

- Semi-transparent plane
- Clear boundary
- Correct intersection with axes
- Correct handling of negative indices

## Labels

```text
x
y
z

O
1
2
∞
```

## Controls

```text
Rotate
Zoom
Pan
Reset
Toggle Axes
Toggle Grid
Toggle Atoms
Toggle Intercepts
Toggle Plane
Toggle Labels
```

## Educational Animation

The application should support:

```text
Intercepts
   ↓
Reciprocals
   ↓
LCM
   ↓
Miller Indices
   ↓
3D Plane
```

---

# 28. Important Mathematical Rules

The engine must correctly handle:

## Standard case

```text
Intercepts:
1, 1, 1

Reciprocals:
1, 1, 1

Miller:
(111)
```

## Infinity

```text
∞ → 0 reciprocal
```

Example:

```text
1, 1, ∞
↓
1, 1, 0
↓
(110)
```

## Fractions

Example:

```text
1/2, 1, ∞
↓
2, 1, 0
↓
(210)
```

## Negative values

Example:

```text
-1, 1, 1
↓
(-1, 1, 1)
↓
(\bar{1}11)
```

The UI should display crystallographic overbar notation correctly.

---

# 29. Terminology Rules

The application should be very precise.

```text
(hkl)     Specific crystal plane
{hkl}     Family of equivalent planes
[uvw]     Specific crystallographic direction
<uvw>     Family of equivalent directions
```

Do not mix these terms.

The student should repeatedly see these distinctions.

---

# 30. Navigation Between Learning and Practice

At the end of every lesson:

```text
Concept Complete ✓

You learned:
✓ Intercepts
✓ Reciprocals
✓ Infinity
✓ Miller notation

Next recommended step:

Guided Practice
[Start Practice →]
```

At the end of guided practice:

```text
Guided Practice Complete ✓

Score: 90%

Ready for Independent Practice?

[Practice Now →]
```

After independent practice:

```text
Great work!

Your accuracy: 88%

Recommended:
Challenge Mode
```

---

# 31. Mobile / Responsive Behavior

The 3D visualization must remain usable on mobile.

Mobile layout:

```text
Lesson
↓
3D Visualization
↓
Explanation
↓
Question
↓
Answer
```

Use touch controls:

- One finger → rotate
- Pinch → zoom
- Two fingers → pan where supported

Do not overload mobile screens with sidebars.

---

# 32. Accessibility

Include:

- Clear typography
- High contrast
- Keyboard navigation
- Non-color-only feedback
- Text descriptions for important diagrams
- Accessible buttons
- Reduced-motion option

---

# 33. Suggested Technical Architecture

## Frontend

Recommended:

```text
React
Vite
JavaScript
Tailwind CSS
Three.js
@react-three/fiber
@react-three/drei
React Router
Framer Motion
Lucide React
```

## No TypeScript

Use JavaScript consistently.

## Core Components

```text
CrystalScene
UnitCell
LatticePoints
CrystalAxes
CrystalPlane
InterceptMarkers
CoordinateLabels
MillerCalculator
StepSolver
QuestionRenderer
AnswerInput
HintSystem
ProgressBar
MasteryCard
ResultsPanel
```

---

# 34. Suggested Route Structure

```text
/
 /dashboard

 /learn
 /learn/fundamentals
 /learn/fundamentals/:lesson

 /learn/miller-indices
 /learn/miller-indices/:lesson

 /explore
 /explore/miller
 /explore/planes

 /practice
 /practice/miller/guided
 /practice/miller
 /practice/miller/challenge

 /practice/planes/guided
 /practice/planes
 /practice/planes/challenge

 /exam
 /exam/setup
 /exam/session
 /exam/results

 /progress
```

---

# 35. MVP Development Order

Do not build all 17 pages at once.

## Phase 1 — Foundation

Build:

1. Landing
2. Dashboard
3. Fundamentals
4. Lesson viewer
5. Simple Cubic 3D scene

## Phase 2 — Miller Indices

Build:

6. Miller Learn
7. Miller Visualizer
8. Guided Practice
9. Independent Practice
10. Challenge

## Phase 3 — Crystal Planes

Build:

11. Plane Learn
12. Plane Explorer
13. Guided Practice
14. Independent Practice
15. Comparison/Challenge

## Phase 4 — Assessment

Build:

16. Exam
17. Results
18. Mastery

Although the conceptual MVP is 17 main pages, the implementation may naturally produce **18–20 routes** because exam setup/session/results and reusable lesson views are separate application states.

---

# 36. What Should NOT Be in the First Version

Avoid adding too much initially.

Do not start with:

- BCC
- FCC
- HCP
- XRD
- All seven crystal systems
- Advanced crystallographic calculations
- Heavy AI chatbot functionality
- Complex social features
- Leaderboards
- Too many gamification elements

First make:

> **Simple Cubic + Miller Indices + Crystal Planes**

exceptionally good.

---

# 37. Future Expansion

Once the SC module is stable:

## Module 2

```text
BCC
```

## Module 3

```text
FCC
```

## Module 4

```text
HCP
```

## Module 5

```text
Crystal Directions
```

## Module 6

```text
Planar Density
```

## Module 7

```text
Linear Density
```

## Module 8

```text
Interplanar Spacing
```

## Module 9

```text
Bravais Lattices
```

## Module 10

```text
X-Ray Diffraction
```

Eventually:

> **Crystallography becomes a complete interactive Materials Engineering learning platform.**

---

# 38. Final Student Experience

The ideal experience should feel like this:

```text
Student opens Crystallography
          ↓
Learns what a crystal is
          ↓
Rotates a Simple Cubic unit cell
          ↓
Learns x/y/z coordinates
          ↓
Learns Miller Indices
          ↓
Sees intercepts in 3D
          ↓
Learns reciprocals
          ↓
Learns LCM
          ↓
Gets (hkl)
          ↓
Sees the actual plane
          ↓
Solves guided problems
          ↓
Solves independent problems
          ↓
Makes mistakes
          ↓
System explains the mistake
          ↓
System identifies weak concept
          ↓
Targeted practice
          ↓
Crystal Planes
          ↓
Visual comparison
          ↓
Challenge
          ↓
Exam
          ↓
Performance analysis
          ↓
Mastery
```

---

# 39. Product Philosophy

The most important principle:

> **Do not teach students to memorize Miller Indices. Teach them to see the geometry behind the indices.**

Every mathematical operation should have a visual counterpart.

```text
INTERCEPT
   ↕
3D LOCATION

RECIPROCAL
   ↕
PLANE ORIENTATION

(hkl)
   ↕
CRYSTAL PLANE

{hkl}
   ↕
PLANE FAMILY
```

The student should finish the module being able to look at a crystal plane and reason:

> "Where does it intersect the axes?"

> "Which axis is parallel?"

> "What are the reciprocals?"

> "What are the Miller indices?"

> "What does that plane actually look like in the crystal?"

That is the real definition of mastery for the first version of **Crystallography**.
