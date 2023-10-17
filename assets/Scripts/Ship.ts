import {
    _decorator,
    Canvas,
    CCInteger,
    Collider2D,
    Component,
    Contact2DType,
    director,
    EventKeyboard,
    Input,
    input,
    instantiate,
    IPhysics2DContact,
    KeyCode,
    Node,
    Prefab,
    Sprite,
    Tween,
    tween,
    UIOpacity,
    UITransform,
    Vec3,
} from 'cc';
import { Bee } from './Bee';
import { StageManager } from './StageManager';
const { ccclass, property } = _decorator;

@ccclass('Ship')
export class Ship extends Component {
    @property(CCInteger)
    public moveSpeed: number;

    public isMovingRight: boolean;
    public isMovingLeft: boolean;
    public isMovingUp: boolean;
    public isMovingDown: boolean;

    @property(Prefab)
    public bulletPrefab: Prefab;

    canvas: Canvas;

    shipHeight: number;

    @property(CCInteger)
    public shipLives: number;

    isContact: boolean;

    @property(Sprite)
    public shipLivesUI: Sprite[] = [];

    @property(Prefab)
    public explosionPrefab: Prefab;

    shipContactTween: Tween<UIOpacity>;

    public static Instance: Ship;

    isReady: boolean = false;

    onLoad() {
        Ship.Instance = this;
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected start(): void {
        const scene = director.getScene();
        this.canvas = scene.getComponentInChildren(Canvas);

        this.shipHeight =
            this.node.getComponent(UITransform).contentSize.height;

        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        let tweenTime = 0.25;
        this.shipContactTween = tween(this.getComponent(UIOpacity))
            .to(tweenTime, { opacity: 0 })
            .to(tweenTime, { opacity: 255 })
            .union()
            .repeat(3);
    }

    Init() {
        this.node.active = true;
        this.isContact = false;
        this.shipLives = 3;
        this.shipLivesUI.forEach((live) => {
            live.node.active = true;
        });
        this.isReady = false;
    }

    Ready() {
        this.isReady = true;
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this.isMovingUp = true;
                break;
            case KeyCode.KEY_A:
                this.isMovingLeft = true;
                break;
            case KeyCode.KEY_S:
                this.isMovingDown = true;
                break;
            case KeyCode.KEY_D:
                this.isMovingRight = true;
                break;
            case KeyCode.SPACE:
                let bullet = instantiate(this.bulletPrefab);
                bullet.setParent(this.canvas.node);
                let bulletPosition = this.node
                    .getPosition()
                    .add3f(0, this.shipHeight, 0);
                bullet.setPosition(bulletPosition);
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this.isMovingUp = false;
                break;
            case KeyCode.KEY_A:
                this.isMovingLeft = false;
                break;
            case KeyCode.KEY_S:
                this.isMovingDown = false;
                break;
            case KeyCode.KEY_D:
                this.isMovingRight = false;
                break;
        }
    }

    update(deltaTime: number) {
        if (!this.isReady) return;

        var horizontalInput = 0;
        var verticalInput = 0;
        if (this.isMovingLeft) {
            horizontalInput = -1;
        } else if (this.isMovingRight) {
            horizontalInput = 1;
        }
        if (this.isMovingDown) {
            verticalInput = -1;
        } else if (this.isMovingUp) {
            verticalInput = 1;
        }
        this.node.translate(
            new Vec3(horizontalInput, verticalInput, 0).multiplyScalar(
                deltaTime * this.moveSpeed
            )
        );
        if (this.isContact) {
            StageManager.Instance.EndStage(false);
            this.node.active = false;
        }
    }

    onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        if (otherCollider.group === Math.pow(2, 3)) {
            otherCollider.getComponent(Bee).HitContact();
            this.HitContact();
        }
    }

    HitContact() {
        this.shipLives -= 1;
        for (let index = 0; index < this.shipLivesUI.length; index++) {
            this.shipLivesUI[index].node.active = index < this.shipLives;
        }

        this.shipContactTween.stop();
        this.shipContactTween.start();

        let explosion: Node = instantiate(this.explosionPrefab);
        explosion.setParent(this.canvas.node, false);
        explosion.setPosition(this.node.getPosition());

        if (this.shipLives <= 0) {
            this.isContact = true;
        }
    }
}
