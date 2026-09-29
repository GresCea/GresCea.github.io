export const Vec3 = {
  subtract(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; },
  normalize(v) {
    const length = Math.hypot(v[0], v[1], v[2]);
    return length < 0.000001 ? [0, 0, 0] : [v[0] / length, v[1] / length, v[2] / length];
  },
  cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; },
  dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
};

export const Mat4 = {
  identity() { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); },
  translation(x, y, z) { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]);},
  rotationX(rad) { const c = Math.cos(rad), s = Math.sin(rad); return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]); },
  rotationY(rad) { const c = Math.cos(rad), s = Math.sin(rad); return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]); },
  scaling(x, y, z) { return new Float32Array([x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1]); },
  multiply(a, b) {
    const out = new Float32Array(16);
    for (let column = 0; column < 4; column += 1) for (let row = 0; row < 4; row += 1) out[column * 4 + row] = a[row] * b[column * 4] + a[4 + row] * b[column * 4 + 1] + a[8 + row] * b[column * 4 + 2] + a[12 + row] * b[column * 4 + 3];
    return out;
  },
  lookAt(position, target, up) {
    const forward = Vec3.normalize(Vec3.subtract(target, position));
    const right = Vec3.normalize(Vec3.cross(forward, up));
    const correctedUp = Vec3.cross(right, forward);
    return new Float32Array([right[0],correctedUp[0],-forward[0],0, right[1],correctedUp[1],-forward[1],0, right[2],correctedUp[2],-forward[2],0, -Vec3.dot(right,position),-Vec3.dot(correctedUp,position),Vec3.dot(forward,position),1]);
  },
  perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2), range = 1 / (near - far);
    return new Float32Array([f / aspect,0,0,0, 0,f,0,0, 0,0,(near + far) * range,-1, 0,0,2 * near * far * range,0]);
  }
};

export function normalMatrixFromMat4(m) {
  const a00=m[0], a01=m[1], a02=m[2], a10=m[4], a11=m[5], a12=m[6], a20=m[8], a21=m[9], a22=m[10];
  const b01=a22*a11-a12*a21, b11=-a22*a10+a12*a20, b21=a21*a10-a11*a20;
  let determinant=a00*b01+a01*b11+a02*b21;
  if (Math.abs(determinant) < 0.000001) return new Float32Array([1,0,0,0,1,0,0,0,1]);
  determinant = 1 / determinant;
  const i00=b01*determinant, i01=(-a22*a01+a02*a21)*determinant, i02=(a12*a01-a02*a11)*determinant;
  const i10=b11*determinant, i11=(a22*a00-a02*a20)*determinant, i12=(-a12*a00+a02*a10)*determinant;
  const i20=b21*determinant, i21=(-a21*a00+a01*a20)*determinant, i22=(a11*a00-a01*a10)*determinant;
  return new Float32Array([i00,i10,i20, i01,i11,i21, i02,i12,i22]);
}
