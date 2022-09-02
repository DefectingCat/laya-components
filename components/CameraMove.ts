export default class CameraMoveScript extends Laya.Script3D {
    /** @private */
    protected _tempVector3: Laya.Vector3 = new Laya.Vector3();
    protected lastMouseX: number;
    protected lastMouseY: number;
    protected yawPitchRoll: Laya.Vector3 = new Laya.Vector3();
    protected resultRotation: Laya.Quaternion = new Laya.Quaternion();
    protected tempRotationZ: Laya.Quaternion = new Laya.Quaternion();
    protected tempRotationX: Laya.Quaternion = new Laya.Quaternion();
    protected tempRotationY: Laya.Quaternion = new Laya.Quaternion();
    protected isMouseDown: boolean;
    protected rotaionSpeed: number = 0.00006;
    protected camera: Laya.BaseCamera;
    protected scene: Laya.Scene3D;

    /**
     * Use mouse wheel to translate.
     */
    protected forwardStep = 0;

    speed: number = 0.01;

    constructor() {
        super();
    }

    /**
     * @private
     */
    protected _updateRotation(): void {
        if (Math.abs(this.yawPitchRoll.y) < 1.5) {
            Laya.Quaternion.createFromYawPitchRoll(
                this.yawPitchRoll.x,
                this.yawPitchRoll.y,
                this.yawPitchRoll.z,
                this.tempRotationZ
            );
            this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
            this.camera.transform.localRotation =
                this.camera.transform.localRotation;
        }
    }

    /**
     * @inheritDoc
     */
    /*override*/ onAwake(): void {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_WHEEL, this, this.mouseWheel);
        //Laya.stage.on(Event.RIGHT_MOUSE_OUT, this, mouseOut);
        this.camera = <Laya.Camera>this.owner;
    }

    /**
     * @inheritDoc
     */
    /*override*/ onUpdate() {
        const elapsedTime = Laya.timer.delta;
        if (
            !isNaN(this.lastMouseX) &&
            !isNaN(this.lastMouseY) &&
            this.isMouseDown
        ) {
            // const scene: Laya.Scene3D = this.owner.scene;
            // Laya.KeyBoardManager.hasKeyDown(87) &&
            //     this.moveForward(-this.speed * elapsedTime); //W
            // Laya.KeyBoardManager.hasKeyDown(83) &&
            //     this.moveForward(this.speed * elapsedTime); //S
            // Laya.KeyBoardManager.hasKeyDown(65) &&
            //     this.moveRight(-this.speed * elapsedTime); //A
            // Laya.KeyBoardManager.hasKeyDown(68) &&
            //     this.moveRight(this.speed * elapsedTime); //D
            // Laya.KeyBoardManager.hasKeyDown(81) &&
            //     this.moveVertical(this.speed * elapsedTime); //Q
            // Laya.KeyBoardManager.hasKeyDown(69) &&
            //     this.moveVertical(-this.speed * elapsedTime); //E

            const offsetX = Laya.stage.mouseX - this.lastMouseX;
            const offsetY = Laya.stage.mouseY - this.lastMouseY;

            const yprElem: Laya.Vector3 = this.yawPitchRoll;
            // yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
            // yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
            yprElem.x += offsetX * this.rotaionSpeed * elapsedTime;
            yprElem.y += offsetY * this.rotaionSpeed * elapsedTime;
            this._updateRotation();
        }
        this.moveForward(this.speed * -this.forwardStep);
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
        this.forwardStep = 0;
    }

    /**
     * @inheritDoc
     */
    /*override*/ onDestroy(): void {
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
        //Laya.stage.off(Event.RIGHT_MOUSE_OUT, this, mouseOut);
    }

    protected mouseDown(e: Event): void {
        this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);

        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
        this.isMouseDown = true;
    }

    protected mouseUp(e: Event) {
        this.isMouseDown = false;
    }

    protected mouseOut(e: Event) {
        this.isMouseDown = false;
    }

    /**
     * Use mouse wheel to scale camera.
     * @param e
     */
    protected mouseWheel(e: Laya.Event) {
        this.forwardStep += e.delta;
    }

    /**
     * 向前移动。
     * @param distance 移动距离。
     */
    moveForward(distance: number): void {
        this._tempVector3.x = this._tempVector3.y = 0;
        this._tempVector3.z = distance;
        this.camera.transform.translate(this._tempVector3);
    }

    /**
     * 向右移动。
     * @param distance 移动距离。
     */
    moveRight(distance: number): void {
        this._tempVector3.y = this._tempVector3.z = 0;
        this._tempVector3.x = distance;
        this.camera.transform.translate(this._tempVector3);
    }

    /**
     * 向上移动。
     * @param distance 移动距离。
     */
    moveVertical(distance: number): void {
        this._tempVector3.x = this._tempVector3.z = 0;
        this._tempVector3.y = distance;
        this.camera.transform.translate(this._tempVector3, false);
    }
}
