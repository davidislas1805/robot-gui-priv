/**
 * Get the rotation matrix from a set of Roll, Pitch and Yaw (all in radians)
 * @param {number} newRoll 
 * @param {number} newPitch 
 * @param {number} newYaw 
 * @returns {Array} Rotation Matrix
 */
function rotMatrixFRPY(newRoll, newPitch, newYaw){ 
    let cosRoll = Math.cos(newRoll);
    let sinRoll = Math.sin(newRoll);
    let cosPitch = Math.cos(newPitch);
    let sinPitch = Math.sin(newPitch);
    let cosYaw = Math.cos(newYaw);
    let sinYaw = Math.sin(newYaw);
    let rotation_matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    rotation_matrix[0] = [cosPitch * cosYaw, -cosPitch * sinYaw, sinPitch];
    rotation_matrix[1] = [(cosYaw * sinRoll * sinPitch) + (cosRoll * sinYaw), (cosRoll * cosYaw) - (sinRoll * sinPitch * sinYaw), -cosPitch * sinRoll];
    rotation_matrix[2] = [-(cosRoll * cosYaw * sinPitch) + (sinRoll * sinYaw), (cosYaw * sinRoll) + (cosRoll * sinPitch * sinYaw), cosRoll * cosPitch];

    return rotation_matrix;
};

/**
 * Obtain radian from given degree
 * @param {number} d_phi 
 * @returns 
 */
function degree2rad(d_phi = 0){
    return (d_phi * Math.PI / 180);
};

/**
 * Obtain degrees from given radian
 * @param {number} r_phi 
 * @returns 
 */
function rad2degree(r_phi = 0){
    return (r_phi * 180 / Math.PI);
};

function getCase(case_key, solution_setA = [], solution_setB = []){
    let solution_buffer = [];
    switch (case_key) {
        case 0:
            solution_buffer = solution_setA[0][0];
            break;
        case 1:
            solution_buffer = solution_setA[0][1];
            break;
        case 2:
            solution_buffer = solution_setA[1][0];
            break;
        case 3:
            solution_buffer = solution_setA[1][1];
            break;
        case 4:
            solution_buffer = solution_setB[1][0];
            break;
        case 5:
            solution_buffer = solution_setB[1][1];
            break;
        case 6:
            solution_buffer = solution_setB[0][0];
            break;
        case 7:
            solution_buffer = solution_setB[0][1];
            break;
        default:
            break;
    }
    return solution_buffer;
};

export {rotMatrixFRPY, degree2rad, rad2degree, getCase};