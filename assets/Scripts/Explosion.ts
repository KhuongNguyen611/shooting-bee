import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass } = _decorator;

@ccclass('Explosion')
export class Explosion extends Component {
    start() {
        let animation = this.node.getComponent(Animation);
        let animState = animation.getState('Explosion');
        this.scheduleOnce(() => this.node.destroy(), animState.duration);
    }
}
