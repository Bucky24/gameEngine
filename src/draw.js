export function line(ctx, x, y, x2, y2, color) {
    ctx.save();

    ctx.strokeColor = color;
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.restore();
}