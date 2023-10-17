import {
    _decorator,
    Canvas,
    Collider2D,
    Component,
    Contact2DType,
    director,
    IPhysics2DContact,
    random,
    randomRange,
    UITransform,
    Vec3,
} from 'cc';
import { Ship } from './Ship';
const { ccclass } = _decorator;

@ccclass('EnemyBullet')
export class EnemyBullet extends Component {
    public moveSpeed: number = 200;

    direction: Vec3;

    public isContact: boolean = false;

    start() {
        let ship = Ship.Instance;
        if (ship && ship.node) {
            let shipPosition = ship.node.getPosition();
            this.direction = shipPosition.subtract(this.node.getPosition());
        } else {
            let scene = director.getScene();
            let canvas = scene.getComponentInChildren(Canvas);
            let canvasHeight = canvas.getComponent(UITransform).height;
            this.direction = new Vec3(
                randomRange(-canvasHeight / 2, canvasHeight / 2),
                -canvasHeight / 2,
                0
            );
        }

        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        if (otherCollider.group === Math.pow(2, 1)) {
            this.isContact = true;
            otherCollider.getComponent(Ship).HitContact();
        }
    }

    onEndContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        if (otherCollider.group === Math.pow(2, 2)) {
            this.isContact = true;
        }
    }

    update(deltaTime: number) {
        this.node.translate(
            this.direction
                .normalize()
                .multiplyScalar(this.moveSpeed * deltaTime)
        );
        if (this.isContact) {
            this.node.destroy();
        }
    }
}
