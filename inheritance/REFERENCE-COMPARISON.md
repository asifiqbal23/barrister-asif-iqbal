# Observed reference-site comparisons

Observed by submitting fictional examples through the public form on [inheritance-calculator.com](https://www.inheritance-calculator.com/) on 18 October 2026. All unmentioned relatives, expenses, debts, land and bequests were zero. Estate: 600,000. The result page uses a form submission; its URL does not preserve the example. These are numerical observations, not copied explanations.

| Input | Reference output | Independent implementation | Finding |
|---|---|---|---|
| Hanafi: wife 1, sons 2, daughter 1 | Wife 1/8 (75,000); each son 7/20 (210,000); daughter 7/40 (105,000) | Same fractions and amounts | Exact match for this observed example. |
| Hanafi: wife 1, son 1, unborn child 1 | Wife 1/8; son 7/16; unborn 7/16 | The one-boy-born-alive scenario has wife 1/8 and each son 7/16. The explorer also shows girl and no-live-birth alternatives. | Matches that provisional boy assumption, not identical overall behavior. |
| Hanafi: father 1, mother 1, wife 1, daughters 2 | Father 4/27 (88,888.89); mother 4/27 (88,888.89); wife 1/9 (66,666.67); each daughter 8/27 (177,777.78) | Same exact fractions; largest-remainder rounding reconciles to 600,000.00 | Fractions match. The reference’s displayed person amounts add to 600,000.01, despite its total label showing 600,000.00. Our rounding differs by 0.01 for one allocation. |
| Shafi‘i: paternal grandfather 1, full sister 1, paternal half-sisters 2 | Grandfather 5/9; full sister 5/18; each paternal sister 1/12 (collectively 1/6) | Grandfather 2/5; full sister 1/2; each paternal sister 1/20 (collectively 1/10) | Substantive mismatch. The independent result follows the explicit mu‘addah example in al-Sirajiyyah. |

## The grandfather mismatch

The al-Sirajiyyah grandfather chapter counts the paternal sisters when comparing the grandfather’s options. With two paternal sisters and one full sister, treating the grandfather as a brother gives him 2/5. The full sister then receives 1/2, leaving 1/10 collectively to the paternal sisters. The fractions sum to 1.

The reference instead assigns 1/6 collectively to the paternal sisters and divides the remaining 5/6 between grandfather and full sister at 2:1. These are different algorithms. This checkpoint does not silently replace the primary rule with the website result to make a test pass.

[Read the Arabic grandfather chapter](https://freeislamicwill.com/index.php/al-sirajiyyah-arabic-text-translation-alsrajyt) and the [independent calculation policy](METHODOLOGY.md).

## Acceptance status

The requested “all cases, identical results” criterion is **not met**. A finite sample cannot establish that criterion, and an actual discrepancy disproves a universal equality claim for this version. Production release remains blocked on resolving the benchmark/rules policy, completing the feature inventory and obtaining specialist review. No claim that the reference site is uniformly correct or uniformly incorrect is made from these examples.
