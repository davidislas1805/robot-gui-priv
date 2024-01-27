/**
 * Class that computes the inverse kinematics for 6-DoF Arm given a set of cartesian coordinates and wrist position.
 *                                              
 * Position --> [x, y, z]       Orientation --> [[r11, r12, r13], [r21, r22, r23], [r31, r32, r33]]
 */
export default class ARM_IK {
    // Private variables
    #LINK_LENGTHS = [];
    #tcp_rot_matrix = [];
    #wrist_vector = [];
    #pos_vector = [];
    #r_arc;
    #s_arc;
    #a3;
    #d6;
    #costh3;
    #baseTh_values = [0.0, 0.0];
    #theta2_values = [0.0, 0.0];
    #theta3_values = [0.0, 0.0];
    #base_to_wrist_rot_matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    #elbow_up = [0, 0, 0, 0, 0, 0];
    #normal_configuration = [0, 0, 0, 0, 0, 0];
    #elbow_down = [0, 0, 0, 0, 0, 0];
    #flip_configuration = [0, 0, 0, 0, 0, 0];
    #conf_q456 = [0, 0, 0];
    #forward = [];
    #backward = [];

    constructor(link_lengths){
        for (let i = 0; i < 6; i++){
            this.#LINK_LENGTHS[i] = link_lengths[i];
        }
        this.#a3 = this.#LINK_LENGTHS[2] + this.#LINK_LENGTHS[3];
        this.#d6 = this.#LINK_LENGTHS[5] + this.#LINK_LENGTHS[4];
    }

    runIK(pos_vector, end_effector_rot_matrix){
        this.#pos_vector = pos_vector;
        this.#tcp_rot_matrix = this.#multiplyMatrices([[0, 0, 1], [1, 0, 0], [0, 1, 0]], end_effector_rot_matrix);
        this.#elbowPosition();
        
        // Get forward solution for elbow up and down:
        this.#elbow_down = this.#getSolution([this.#baseTh_values[0], this.#theta2_values[0], this.#theta3_values[0]]);
        this.#elbow_up = this.#getSolution([this.#baseTh_values[0], this.#theta2_values[1], this.#theta3_values[1]]);
        this.#forward = [this.#elbow_down, this.#elbow_up];

        // Get backward solution for elbow up and down:
        this.#elbow_down = this.#getSolution([this.#baseTh_values[1], this.#theta2_values[2], this.#theta3_values[2]]);
        this.#elbow_up = this.#getSolution([this.#baseTh_values[1], this.#theta2_values[3], this.#theta3_values[3]]);
        this.#backward = [this.#elbow_down, this.#elbow_up];

        return [this.#forward, this.#backward];
    }

    // Compute the rotation matrix with D-H parameters given the calculated angles from the first three joints
    #baseToWristRM(theta1, theta2, theta3){
        let baseCos = Math.cos(theta1);
        let baseSin = Math.sin(theta1);
        let cos23 = Math.cos((theta2 + theta3));
        let sin23 = Math.sin((theta2 + theta3));

        this.#base_to_wrist_rot_matrix[0] = [baseCos * cos23, -baseCos * sin23, baseSin];
        this.#base_to_wrist_rot_matrix[1] = [baseSin * cos23, -baseSin * sin23, -baseCos];
        this.#base_to_wrist_rot_matrix[2] = [sin23, cos23, 0];

        // Ideally this part is not necessary but the angles did not match without this rotation, obtained after numerous tries
        let config_base_to_wrist_rot_matrix = this.#multiplyMatrices(this.#base_to_wrist_rot_matrix, [[0, 0, 1], [1, 0, 0], [0, 1, 0]]);
        
        return this.#transposeMatrix(config_base_to_wrist_rot_matrix);
    }

    // Compute the wrist angles needed to achieve the desired TCP orientation
    #computeWristAngles(theta1, theta2, theta3){
        let q456, desired_rotation;

        let config_transpose_matrix = this.#baseToWristRM(theta1, theta2, theta3);
        
        desired_rotation = this.#multiplyMatrices(this.#multiplyMatrices(config_transpose_matrix, this.#tcp_rot_matrix), [[0, -1, 0], [1, 0, 0], [0, 0, 1]]);

        q456 = this.#getEulerFromZYZ(desired_rotation);
        return q456;
    }

    // Compute the first three joints' angles to achieve the desired cartesian orientation
    #elbowPosition(){
        this.#wrist_vector[0] = (this.#pos_vector[0] - (this.#d6 * this.#tcp_rot_matrix[0][2]));
        this.#wrist_vector[1] = (this.#pos_vector[1] - (this.#d6 * this.#tcp_rot_matrix[1][2]));
        this.#wrist_vector[2] = (this.#pos_vector[2] - (this.#d6 * this.#tcp_rot_matrix[2][2]));
        
        // Solve for Base Theta --> Theta1:
        this.#baseTh_values[0] = Math.atan2(this.#wrist_vector[1], this.#wrist_vector[0]);      // Forward Position
        this.#baseTh_values[1] = this.#baseTh_values[0] + Math.PI;                              // Backward Position
        
        this.#r_arc = Math.sqrt(Math.pow(this.#wrist_vector[0], 2) + Math.pow(this.#wrist_vector[1], 2));
        this.#s_arc = this.#wrist_vector[2] - this.#LINK_LENGTHS[0];

        // Solve for Joint 2 --> Theta3:
        this.#costh3 = (Math.pow(this.#r_arc, 2) + Math.pow(this.#s_arc, 2) - Math.pow(this.#LINK_LENGTHS[1], 2) - Math.pow(this.#a3, 2)) / (2 * this.#LINK_LENGTHS[1] * this.#a3);

        this.#theta3_values[0] = Math.atan2(Math.sqrt(1 - Math.pow(this.#costh3, 2)), this.#costh3);   // Elbow Up  
        this.#theta3_values[1] = Math.atan2(-Math.sqrt(1 - Math.pow(this.#costh3, 2)), this.#costh3);   // Elbow Down
        this.#theta3_values[2] = -this.#theta3_values[0];
        this.#theta3_values[3] = -this.#theta3_values[1];
        
        // Solve for Joint 1 --> Theta2:
        this.#theta2_values[0] = this.#q2Fromq3(this.#theta3_values[0]);
        this.#theta2_values[1] = this.#q2Fromq3(this.#theta3_values[1]);
        this.#theta2_values[2] = Math.PI - this.#theta2_values[0];
        this.#theta2_values[3] = Math.PI - this.#theta2_values[1];
    }

    #q2Fromq3(theta3){
        return Math.asin((((this.#LINK_LENGTHS[1] + this.#a3 * Math.cos(theta3)) * this.#s_arc) - (this.#a3 * Math.sin(theta3) * this.#r_arc)) / (Math.pow(this.#r_arc, 2) + Math.pow(this.#s_arc, 2)));
    }

    #getSolution(manipulator_angles = []){
        this.#normal_configuration = [...manipulator_angles];
        this.#flip_configuration = [...manipulator_angles];

        this.#conf_q456 = this.#computeWristAngles(manipulator_angles[0], manipulator_angles[1], manipulator_angles[2]);
        this.#normal_configuration.push(this.#conf_q456[0][0], this.#conf_q456[1][0], this.#conf_q456[2]);
        this.#flip_configuration.push(this.#conf_q456[0][1], this.#conf_q456[1][1], this.#conf_q456[2]);

        return [this.#normal_configuration, this.#flip_configuration];
    }

    // for debugging get the ZYZ rotation matrix from a set of angles
    #eulerZYZ(phi, theta, psi){
        let theta4Cos = Math.cos(phi);
        let theta4Sin = Math.sin(phi);
        let theta5Cos = Math.cos(theta);
        let theta5Sin = Math.sin(theta);
        let theta6Cos = Math.cos(psi);
        let theta6Sin = Math.sin(psi);

        let zyz_matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        zyz_matrix[0] = [(theta4Cos * theta5Cos * theta6Cos) - (theta4Sin * theta6Sin), -(theta4Cos * theta5Cos * theta6Sin) - (theta4Sin * theta6Cos), theta4Cos * theta5Sin];
        zyz_matrix[1] = [(theta4Sin * theta5Cos * theta6Cos) + (theta4Cos * theta6Sin), -(theta4Sin * theta5Cos * theta6Sin) + (theta4Cos * theta6Cos), theta4Sin * theta5Sin];
        zyz_matrix[2] = [-theta5Sin * theta6Cos, theta5Sin * theta6Sin, (theta5Cos)];

        console.table(zyz_matrix);
    }

    // Get the euler angles from a ZYZ rotation matrix
    #getEulerFromZYZ(euler_matrix){
        let phi = [], theta = [], psi;

        theta[0] = Math.atan2(Math.sqrt(Math.pow(euler_matrix[1][2], 2) + Math.pow(euler_matrix[0][2], 2)), euler_matrix[2][2]);
        theta[1] = -theta[0];

        if(theta === Math.PI){
            phi[0] = -Math.atan2(euler_matrix[1][0], euler_matrix[1][1]);
            psi = 0;
        }else if(theta === 0){
            phi[0] = Math.atan2(euler_matrix[1][0], euler_matrix[1][1]);
            psi = 0;
        }else{
            phi[0] = Math.atan2(euler_matrix[1][2], euler_matrix[0][2]);
            psi = Math.atan2(euler_matrix[2][1], -euler_matrix[2][0]);
        }
        phi[1] = Math.PI + phi[0];
        
        return [phi, theta, psi]; 
    }

    #multiplyMatrices(matrixA, matrixB){
        let result_matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < 3; i++){
            for (let k = 0; k < 3; k++){
                for (let j = 0; j < 3; j++){
                    result_matrix[i][k] += matrixA[i][j] * matrixB[j][k];
                }
            }
        }
        return result_matrix;
    }

    #transposeMatrix(orig_matrix){
        let trans_matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        let temp_row = [0, 0, 0];
        for(let i = 0; i < 3; i++){
            temp_row = orig_matrix[i];
            for(let j = 0; j < 3; j++){
                trans_matrix[j][i] = temp_row[j];
            }
        }
        
        return trans_matrix;
    }
}