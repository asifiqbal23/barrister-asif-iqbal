# Islamic inheritance calculator — educational release

Updated 18 October 2026. Independently written for Barrister Asif Iqbal’s portfolio.

**This is an educational implementation, not a completed reproduction of every case on inheritance-calculator.com. Verify all facts and applicable law before distributing an estate.** No scholar, court or chamber has certified this implementation. Complete equivalence with the reference website has not been established. See [the observed comparisons](REFERENCE-COMPARISON.md).

## What the program actually does

All arithmetic runs in the visitor’s browser. There is no embedded third-party calculator, remote calculation request, account, tracking script or stored family record. Source links open separately only when selected. GitHub serves the static files.

The form has 67 relative categories, six named juristic profiles, English and Bengali interfaces, monetary deductions, a fractional bequest, land units and a custom land conversion. Detailed juristic explanations are currently in English. Selecting “no school” compares the six profiles rather than inventing a universally agreed result.

Results show exact group and individual fractions, percentages, amounts, excluded relatives, original explanatory text, calculation steps and source links. Unequal Tanzil branches receive individual rows. Print/PDF uses the browser’s print facility; CSV exports the selected outcome.

## Implemented policies

| Area | Selected treatment |
|---|---|
| Fixed shares and residue | Spouses, parents, eligible grandparents, children, descendants through sons, siblings and the listed agnates; closer relatives and prescribed-share exhaustion can exclude others. |
| Awl | Scale prescribed shares proportionately when their sum exceeds the estate. |
| Radd | Automatic return to non-spouse sharers in the Hanafi, Abu Yusuf, Muhammad and Hanbali profiles. Classical Maliki/Shafi‘i policy leaves a separately identified balance. User overrides are explicitly identified. |
| Umariyyah | Mother takes one-third of the spouse remainder with both parents; the Abu Yusuf profile also applies its transmitted grandfather variant. |
| Mushtarakah | Selected Maliki/Shafi‘i treatment pools eligible full and maternal siblings in their one-third portion, equally per person. |
| Grandfather and siblings | Abu Hanifa profile blocks siblings. The other five profiles use the selected Zayd approach, including muqasamah, the grandfather’s alternatives, mu‘addah and Akdariyyah. |
| Grandmothers | School-dependent exclusion by an intervening ascendant, degree priority and eligible lines. The selected Hanbali view permits a grandmother with her son; the selected Maliki view excludes the paternal grandfather’s mother as a fixed sharer. |
| Hanafi distant kindred | Class/degree priority. Hanafi and Muhammad profiles use the transmitted Muhammad approach; Both students use the reported sibling-descendant priority over the maternal grandfather; Abu Yusuf uses its per-person distribution method. Mixed remote ascendants with sibling descendants or aunts/uncles stop for review because a blanket class priority can fail. Maternal sibling offspring divide equally under the selected mainstream report. The ascendant tie preference follows the al-Khassaf view described in al-Sirajiyyah. These are selected opinions, not every reported opinion. |
| Hanbali distant kindred | Tanzil through child, father and mother directions. Necessary connecting branches must be entered. The selected opinion gives equally related male and female branch members equal portions. Other transmitted opinions exist. |
| Unborn children | Enumerate alternative live-birth outcomes for up to four children. No claim to establish pregnancy, parentage, gestation, a sufficient reserve or a distribution date. |
| Uncertain eligibility | Compare inclusion and exclusion of identified relatives. The program does not determine legal survival, homicide, religion or parentage. |
| Adoption/fosterage | No blood-heir share arises merely from adoption/fosterage. Any independent blood relationship must be entered correctly. A valid bequest is a separate issue. |

## Boundaries that remain

- No universal parity claim with the reference website. Its actual observed output conflicts with a primary worked mu‘addah example, and its independent monetary rounding can overstate the total by a minor unit.
- Multiple family relationships for one person, successive estates or uncertain death order require a family-tree assessment.
- Bangladesh section 4 branch totals are calculated in the separate Bangladesh profile; multi-child intrabranch division is not automated. See the [Muslim Family Laws Ordinance, 1961, section 4](https://bdlaws.minlaw.gov.bd/act-print-305/section-print-13528.html).
- Bequests to heirs, bequests beyond the one-third model, debts exceeding the entered monetary estate and disputed eligibility require review.
- An unallocated balance is not automatically assumed to be paid to a functioning public treasury or to a spouse.
- Family counts alone cannot verify lineage, simultaneous survival, ownership, marriage validity, legal disqualification or local law. Counts can also describe an impossible family; the form’s basic validation is not a genealogy audit.
- Only the enumerated relatives and selected opinions are represented. All 23 languages of the reference site, its entire explanatory corpus and every combination have not been reproduced.
- The three debt fields are added together, matching the observed reference example. Enter each debt once; “other debts” excludes amounts entered in the before/during-final-illness fields.

## Money and land assumptions

Monetary estate less funeral/burial expense, unpaid dower and the three debt amounts gives the bequest base. A bequest of at most one-third is then deducted. Its amount is rounded down to the nearest minor currency unit. All money inputs and outputs use two decimals; currencies with different minor-unit conventions need separate handling.

Inheritance shares use arbitrary-precision rational arithmetic. Money is allocated by largest remainders, reconciling individual/group amounts to the net estate. A one-minor-unit difference between equal heirs is a rounding assignment, not an extra legal right. Decimal percentages and land values are approximations of the exact fractions.

Land is entered **net of applicable obligations and bequests**; monetary obligations are not deducted again from land. One acre is 43,560 square feet; square yard is 9 square feet; the displayed marla/pole is 272.25 square feet and kanal 5,445 square feet. Local variants need the custom unit. One decimal/shotok is 435.6 square feet. Metric conversion uses the exact international foot definition.

## Sources and originality

The program, interface and explanations are original. No calculator source code, private backend, website graphics or long passages from the reference website are reproduced. Numerical examples are recorded as test facts.

Primary rules were checked against:

- [Qur’an 4:11](https://quran.com/4/11), [4:12](https://quran.com/4/12) and [4:176](https://quran.com/4/176).
- [Al-Sarakhsi, al-Mabsut, volume 30](https://ar.wikisource.org/wiki/مبسوط_السرخسي_-_الجزء_الثلاثون), pp. 4, 28 and 39–40: distant-kindred priorities and selected gender-weighting reports.
- [Sahih al-Bukhari 6732](https://sunnah.com/bukhari:6732) and [6736](https://sunnah.com/bukhari:6736).
- *Al-Sirajiyyah*, grandfather-sharing and distant-kindred chapters; [public-domain Arabic text reproduced here](https://freeislamicwill.com/index.php/al-sirajiyyah-arabic-text-translation-alsrajyt). The modern translation is separately authored; it has not been copied into this tool.
- Ibn Qudamah, *al-Mughni*, [Kitab al-Fara’id (Arabic)](https://ar.wikisource.org/wiki/المغني_-_كتاب_الفرائض), including grandfather, grandmother and Tanzil discussions.

Supporting worked examples and contemporary explanations include [Cheema (2021), JITC 11(1), pp. 118–120](https://journals.umt.edu.pk/index.php/JITC/article/download/1228/619/) and the source links attached to individual results. A secondary comparative statement is not preferred over a conflicting primary discussion merely to obtain a match.

## Validation record

Run `node --test inheritance/tests/engine.test.js` from the repository root.

At this release, 72 automated tests passed. These include twenty externally worked family examples, method variants, two mu‘addah examples, selected distant-kindred cases, grandmother differences, unequal branches, conditional scenarios, input validation, money and land arithmetic.

Before the added remote-ascendant review guard, a separate pairwise arithmetic check examined every pair of the 67 categories across six profiles: 13,247 returned an allocation, 13 requested branch review and 6 rejected conflicting spouses. Every allocation reconciled to exactly one without a negative portion. **This checks arithmetic invariants, not the legal correctness of all those cases.**

Only the explicitly recorded reference-site observations have been compared. These tests do not establish exhaustiveness, legal validity or reference-site parity. Independent specialist review is still needed before treating this educational aid as a distribution authority. A DOM integration check covers the result views, scenario switching, source links and review states. The managed local-preview service was unavailable; the published page is checked separately in the browser.


## Bangladesh statutory overlay — 18 October 2026

`bangladesh.js` applies an explicit Bangladesh/Hanafi profile before the scenario layer. It represents each qualifying predeceased direct child once, calculates the notional family, then replaces that child’s individual share with a statutory branch allocation. Living children retain only their own shares. Exact shares, money reconciliation and land proportions use the resulting rows.

- No double-counting grandchildren in ordinary fields; deeper descendant claims stop for family-tree review.
- No predeceased spouse/sibling representation, recursive great-grandchild substitution or distribution to the deceased intermediate child’s other heirs is inferred.
- A branch with one living child yields an individual award. Multiple-child branches have `collective: true`, `beneficiaryCount`, `count: 1` accounting unit and `each: null`. They must never be displayed as equal per-person awards.
- School/radd overrides are excluded from this profile. Classical calculations remain separately available.
- Relevant unresolved divorce, missing-person and special-property questions prevent allocation; the result contains the corresponding statutory references.
- Historical/boundary-date estates stop for review. This is not a complete Bangladesh legal expert system.

The primary statutory and judgment sources, implementation status and legal interpretation boundary are recorded in [Bangladesh law coverage](bangladesh.html). Section 4 determines the branch total; a binding universal Bangladesh formula for splitting a mixed-sex branch was not established in this review. Neither a 2:1 nor an equal intrabranch rule is silently imposed.

Tests in `tests/bangladesh.test.js` cover branch representation, unequal family sizes, surviving heirs, spouse and parent changes, awl/radd, deductions, invalid inputs, no duplicate entitlement, exact conservation and reference delivery. These are software verification tests, not external legal certification.
