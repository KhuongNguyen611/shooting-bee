import { _decorator, CCString, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MenuScreen')
export class MenuScreen extends Component {
    @property(CCString)
    public startStageName: string;

    NewGame() {
        director.loadScene('Stage1');
    }
}
