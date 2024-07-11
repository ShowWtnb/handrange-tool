import { combinations } from "@/component/utils/utils"

class pNode {
    children: { [name: string]: pNode } = {} // 行動をkey、子ノードをvalueとします。例えば{'check': 子ノード1, 'bet': 子ノード2}のような形になります。
    player = -1  // このノードの手番プレイヤーです。チャンスノードの場合は-1とします。
    terminal = false  // 終端ノードの場合はTrueとなります。
    private_cards?: Hand[]  // それぞれのプレイヤーのハンドです。
    history: string[] = []  // このノードと対応する履歴hです。ただしチャンスノードの行動、つまり手札の配り方はprivate_cardsで持つようにしてhistoryに含めないようにします。
    information = {}  // このノードの手番プレイヤーが知ることのできる情報、つまり自身のカードとお互いの行動履歴です。
    pi = 0  // 履歴の到達確率π(h)です。
    pi_mi = 0  // π(h)のうち手番プレイヤー以外の貢献π_{-i}(h)です。
    pi_i = 0  // π(h)のうち手番プレイヤーのみの貢献π_{i}(h)です。平均戦略の計算に使用します。
    eu = 0  // ノードの期待利得u(h)です。期待利得はプレイヤー0が得られる利得とします。(プレイヤー1の利得は符号を反転させたものになります。)
    cv = 0  // counterfactual valueの値です。
    cfr: { [name: string]: number } = {}  // 各行動aにおけるcounterfactual regretの累積値です。
    pi_i_sum = 0  // 平均戦略を計算する際の分母です。
    pi_sigma_sum: { [name: string]: number } = {}  // 平均戦略を計算する際の分子です。
    constructor(player: number, terminal: boolean, eu: number = 0.0) {
        player = player;
        terminal = terminal;
        eu = eu;
    }
    expand_child_node(action: string, next_player: number, terminal: boolean, utility: number = 0, private_cards?: Hand[]): any {
        // """
        // childrenにactionをキーとして子ノードを追加します。
        // 子ノードの履歴は親ノードの履歴にactionを追加したもの、子ノードの情報は次のプレイヤーの手札と履歴をあわせたものになります。
        // """
        var next_node = new pNode(next_player, terminal, utility)
        this.children[action] = next_node
        this.cfr[action] = 0
        this.pi_sigma_sum[action] = 0
        // 手札は最初に配られたとき以外は前のノードのものを引き継ぎます。
        if (private_cards === undefined) {
            next_node.private_cards = private_cards
        } else {
            next_node.private_cards = this.private_cards
        }
        // 前のノードがチャンスプレイヤー以外の場合はhistoryを更新します。
        if (this.player != -1) {
            next_node.history = [...this.history, action]
        } else {
            next_node.history = this.history

        }
        next_node.information = (next_node?.private_cards?.at(next_player), (next_node.history))
        return next_node

    }

}

function add_list_to_dict(target_dict: any, a_key: any, value: any) {
    // 同じ情報集合に属するノードをまとめるためのutility関数です。
    console.log('KuhnPoker add_list_to_dict', target_dict, a_key, value)
    try {
        const keys = target_dict.keys();
        console.log('KuhnPoker add_list_to_dict', 'keys', keys)
        keys.forEach((key: string) => {
            if (key === a_key) {
                target_dict[key].append(value)
            }
            // else {
            //     target_dict[a_key] = [value]
            // }
        })
    } catch (error) {
        console.log('KuhnPoker add_list_to_dict', 'catch')
        target_dict[a_key] = [value]
    } finally {
        console.log('KuhnPoker add_list_to_dict', 'finally')
        return target_dict;
    }
}

// ひとつでも重複していたらtrue
function isDuplicated(hand_0: any[], hand_1: any[]): boolean {
    for (let i = 0; i < hand_0.length; i++) {
        const element = hand_0[i];
        for (let j = 0; j < hand_1.length; j++) {
            const element2 = hand_1[j];
            if (element === element2) {
                return true;
            }
        }
    }
    return false
}

export class KuhnPoker {
    num_players: number = 2
    deck = [0, 1, 2]
    information_sets: { [key: number]: object } = {
        '-1': {} // プレイヤー-1はチャンスプレイヤーを表します。
    }
    root: any

    constructor() {
        this.num_players = 2
        this.deck = [0, 1, 2]
        for (let i = 0; i < this.num_players; i++) {
            this.information_sets[i] = {};
        }
        console.log('KuhnPoker constructor information_sets', this.information_sets)
        this.root = this._build_game_tree()
        console.log('KuhnPoker constructor', this.root)
    }
    _build_game_tree() {
        var stack: any[] = []  // stackを使って深さ優先探索を行います。
        var next_player = -1
        var root = new pNode(next_player, false)
        this.information_sets[next_player] = add_list_to_dict(this.information_sets[next_player], root.information, root)  // プレイヤー毎に同じ情報を持つノードをまとめておきます。
        var hands_0 = combinations(this.deck, 1)
        // console.log('KuhnPoker _build_game_tree', hands_0)
        for (let i = 0; i < hands_0.length; i++) {
            const hand_0 = hands_0[i];
            var hands_1 = combinations(this.deck, 1)
            for (let j = 0; j < hands_1.length; j++) {
                const hand_1 = hands_1[j];
                // console.log('KuhnPoker _build_game_tree', hand_0, hand_1)
                if (isDuplicated(hand_0, hand_1)) {  // 同じカードが配布されていた場合
                    // console.log('KuhnPoker _build_game_tree', 'Duplicated')
                    continue
                }
                // console.log('KuhnPoker _build_game_tree', hand_0, hand_1)

                var private_cards = [hand_0, hand_1, []]  // それぞれp0, p1, chance playerの情報です。
                next_player = 0
                var tmpActionStr = String(...hand_0) + ',' + String(...hand_1);
                var node = root.expand_child_node(tmpActionStr, next_player, false, 0, private_cards)  // 各行動についてノードを展開します。
                this.information_sets[next_player] = add_list_to_dict(this.information_sets[next_player], node.information, node)  // 新しく展開したノードを適切な情報集合に加えます。
                stack.push(node)
                const actions = ["check", "bet"]
                for (let k = 0; k < actions.length; k++) {
                    const p0action = actions[k]; // p0の取りうる行動
                    next_player = 1
                    node = node.expand_child_node(p0action, next_player, false)
                    this.information_sets[next_player] = add_list_to_dict(this.information_sets[next_player], node.information, node)
                    stack.push(node)
                    if (p0action == "check") {
                        for (let l = 0; l < actions.length; l++) {
                            const p1action = actions[l];  // p1の取りうる行動
                            if (p1action == "check") {
                                var utility = this._compute_utility(p1action, next_player, hand_0, hand_1)  // p1がcheckなら利得を計算してゲーム終了です。
                                next_player = -1  // 終端ノードのプレイヤーは-1とします。
                                node = node.expand_child_node(p1action, next_player, true, utility)
                                this.information_sets[next_player] = add_list_to_dict(this.information_sets[next_player], node.information, node)
                                node = stack.pop()
                            }
                            if (p1action == "bet") {
                                next_player = 0
                                node = node.expand_child_node(p1action, next_player, false)
                                this.information_sets[next_player] = add_list_to_dict(this.information_sets[next_player], node.information, node)
                                stack.push(node)
                                const actions2 = ["check", "bet"]
                                for (let m = 0; m < actions2.length; m++) {
                                    const p0action2 = actions2[m];  // player 0 actions
                                    utility = this._compute_utility(p0action2, next_player, hand_0, hand_1)
                                    next_player = -1
                                    node = node.expand_child_node(p0action2, next_player, true, utility)
                                    this.information_sets[next_player] = add_list_to_dict(this.information_sets[next_player], node.information, node)
                                    node = stack.pop()
                                }
                            }

                        }
                    } else if (p0action == "bet") {
                        stack.push(node)
                        const actions3 = ["fold", "call"]
                        for (let l = 0; l < actions3.length; l++) {
                            const p1action2 = actions3[l]; // player 1 actions
                            utility = this._compute_utility(p1action2, next_player, hand_0, hand_1)
                            next_player = -1
                            node = node.expand_child_node(p1action2, next_player, true, utility)
                            this.information_sets[next_player] = add_list_to_dict(this.information_sets[next_player], node.information, node)
                            node = stack.pop()
                        }
                    }
                }

            }

        }
        return root
    }
    _compute_utility(action: string, player: number, hand_0: number[], hand_1: number[]) {
        // ルールにしたがって利得を計算します。
        const card_0 = hand_0[0]
        const card_1 = hand_1[0]
        const is_win = card_0 > card_1
        var utility
        if (action == "fold") {
            if (player == 1) {
                utility = 1
            } else {
                utility = -1
            }
        }
        else if (action == "check") {
            if (is_win) {
                utility = 1
            } else {
                utility = -1
            }
        }
        else if (action == "call") {
            if (is_win) {
                utility = 2
            } else {
                utility = -2
            }
        }
        else {
            utility = 0
        }
        return utility
    }

}

class histories {

}
class Card {

}
class Hand {
    cards?: Card[]
}

enum Action {

}


// function solve(count: number) {
//     const players = [0, 1];
//     for (let t = 0; t < count; t++) {
//         for (let i = 0; i < players.length; i++) {
//             const element = players[i]
//             cfr([], i, t, 1, 1)
//         }
//     }
//     return
// }

// function cfr(h: histories, i: any, t: any, pi_i: any, pi_negI: any): any {
//     if (isTerminal(h)) {
//         return ui_expected_gain(h)
//     } else if (isChanceNode(h)) {
//         const availableActions = available_actions(h)
//         var sum = 0
//         for (let i = 0; i < availableActions.length; i++) {
//             const action = availableActions[i];
//             sum += strategy(h, action) * cfr(ha(h, action), i, t, pi_i, strategy(h, action) * pi_negI)
//         }
//         return sum
//     }

//     const I = [...i, h] // hを含む情報集合
//     const available = available_actions(I)
//     for (let i = 0; i < available.length; i++) {
//         const action = available[i];
//         for (let j = 0; j < available.length; j++) {
//             const element = available[j];
//             regret_T_plus(I, element)
//         }
//         if () {

//         } else {

//         }
//     }
// }

// function isTerminal(h: histories): boolean {
//     throw new Error("Function not implemented.");
// }
// function ui_expected_gain(h: histories) {
//     throw new Error("Function not implemented.");
// }

// function isChanceNode(h: histories): boolean {
//     throw new Error("Function not implemented.");
// }

// function available_actions(h: histories): Action[] {
//     throw new Error("Function not implemented.");
// }

// function strategy(h: histories, action: Action): any {
//     throw new Error("Function not implemented.");
// }

// function ha(h: histories, a: any): histories {
//     throw new Error("Function not implemented.");
// }

// function regret_T_plus(I: any[], a: any) {
//     max(regret_T(I, a), 0)
//     throw new Error("Function not implemented.");
// }

// function regret_T(I: any[], a: any): any {
//     for (let i = 0; i < T; i++) {
//         const element = regret(t, I, a)
//     }
//     throw new Error("Function not implemented.");
// }

// function max(arg0: any, arg1: number) {
//     throw new Error("Function not implemented.");
// }

