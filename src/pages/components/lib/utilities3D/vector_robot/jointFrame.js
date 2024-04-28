import VECTOR_LINK from "./vectorLink";

export default class JOINT_FRAME {
    // Private locations
    #DATA_HOLDER;
    #INIT_MATRIX;
    #cosRoll;
    #sinRoll;
    #cosPitch;
    #sinPitch;
    #cosYaw;
    #sinYaw;

    //VECTOR
    #Z_NORM_MATRIX = [[0, 0, -1], [0, 1, 0], [1, 0, 0]];
    #X_NORM_MATRIX = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    #VECTOR_LINK = new VECTOR_LINK(0, 0, 0, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 4.0);

    // Private Constants
    #X_AXIS_COLOR = "red";
    #Y_AXIS_COLOR = "green";
    #Z_AXIS_COLOR = "blue";
    #LINE_WIDTH = 7;
    #LINE_AXIS_LENGTH = 4.0;
    #CONE_VECTOR_LENGTH = this.#LINE_AXIS_LENGTH + 1.0;

    // 3D frame elements declaration:
    X_AXIS_LINE = {
        name: "x-axis",
        showlegend: false,
        mode: "lines",
        type: "scatter3d",
        hoverinfo: "none",
        x: [0, 0],
        y: [0, 0],
        z: [0, 0],
        line: {
            color: this.#X_AXIS_COLOR,
            width: 7
        }
    };
    
    X_AXIS_CONE = {
        type: "cone",
        x: [0, 0],
        y: [0, 0],
        z: [0, 0],
        u: [0],
        v: [0],
        w: [0],  // z[1] - z[0]
        anchor: "tip",
        hoverinfo: "none",
        colorscale: [[0, this.#X_AXIS_COLOR], [1, this.#X_AXIS_COLOR]],
        showscale: false,
    };
        
    Y_AXIS_LINE = {
        name: "y-axis",
        showlegend: false,
        mode: "lines",
        type: "scatter3d",
        hoverinfo: "none",
        x: [0, 0],
        y: [0, 0],
        z: [0, 0],
        line: {
        color: this.#Y_AXIS_COLOR,
        width: this.#LINE_WIDTH
        }
    };
        
    Y_AXIS_CONE = {
        type: "cone",
        x: [0, 0],
        y: [0, 0],
        z: [0, 0],
        u: [0],
        v: [0],
        w: [0],
        anchor: "tip",
        hoverinfo: "none",
        colorscale: [[0, this.#Y_AXIS_COLOR], [1, this.#Y_AXIS_COLOR]],
        showscale: false,
    };
      
    Z_AXIS_LINE = {
        name: "z-axis",
        showlegend: false,
        mode: "lines",
        type: "scatter3d",
        hoverinfo: "none",
        x: [0, 0],
        y: [0, 0],
        z: [0, 0],
        line: {
          color: this.#Z_AXIS_COLOR,
          width: this.#LINE_WIDTH
        }
    };
        
    Z_AXIS_CONE = {
        type: "cone",
        x: [0, 0],
        y: [0, 0],
        z: [0, 0],
        u: [0],
        v: [0],
        w: [0],
        anchor: "tip",
        hoverinfo: "none",
        colorscale: [[0, this.#Z_AXIS_COLOR], [1, this.#Z_AXIS_COLOR]],
        showscale: false,
    };

    constructor(x, y, z, roll, pitch, yaw, init_matrix, link_length, link_norm = "x", link_color = "cyan"){ // Angles in radians
        this.rotation_matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.xyz = [x, y, z];
        this.euler = [roll, pitch, yaw];
        this.x_l_vector = [this.#LINE_AXIS_LENGTH, 0, 0];
        this.x_c_vector = [this.#CONE_VECTOR_LENGTH, 0, 0];
        this.y_l_vector = [0, this.#LINE_AXIS_LENGTH, 0];
        this.y_c_vector = [0, this.#CONE_VECTOR_LENGTH, 0];
        this.z_l_vector = [0, 0, this.#LINE_AXIS_LENGTH];
        this.z_c_vector = [0, 0, this.#CONE_VECTOR_LENGTH];
        this.#INIT_MATRIX = init_matrix;

        this.#VECTOR_LINK.reinitializeVector(this.xyz[0], this.xyz[1], this.xyz[2], (link_norm === "x" ? this.#X_NORM_MATRIX : link_norm === "z" ? this.#Z_NORM_MATRIX : null), link_length, link_color);
        
        this.updateFrame(x, y, z, this.euler[0], this.euler[1], this.euler[2], this.#INIT_MATRIX);
    };

    setLinkLength(x, y, z, roll, pitch, yaw, init_matrix, link_length, link_norm = "x", link_color = "cyan"){ // Angles in radians
        this.rotation_matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.xyz = [x, y, z];
        this.euler = [roll, pitch, yaw];
        this.x_l_vector = [this.#LINE_AXIS_LENGTH, 0, 0];
        this.x_c_vector = [this.#CONE_VECTOR_LENGTH, 0, 0];
        this.y_l_vector = [0, this.#LINE_AXIS_LENGTH, 0];
        this.y_c_vector = [0, this.#CONE_VECTOR_LENGTH, 0];
        this.z_l_vector = [0, 0, this.#LINE_AXIS_LENGTH];
        this.z_c_vector = [0, 0, this.#CONE_VECTOR_LENGTH];
        this.#INIT_MATRIX = init_matrix;

        this.#VECTOR_LINK.reinitializeVector(this.xyz[0], this.xyz[1], this.xyz[2], (link_norm === "x" ? this.#X_NORM_MATRIX : link_norm === "z" ? this.#Z_NORM_MATRIX : null), link_length, link_color);
        
        this.updateFrame(x, y, z, this.euler[0], this.euler[1], this.euler[2], this.#INIT_MATRIX);
    };
    
    // Angles in radians
    updateFrame(newX, newY, newZ, newRoll, newPitch, newYaw, past_frame_matrix){
        this.xyz = [newX, newY, newZ];
        this.#cosRoll = Math.cos(newRoll);
        this.#sinRoll = Math.sin(newRoll);
        this.#cosPitch = Math.cos(newPitch);
        this.#sinPitch = Math.sin(newPitch);
        this.#cosYaw = Math.cos(newYaw);
        this.#sinYaw = Math.sin(newYaw);
        
        past_frame_matrix = this.#multiplyMatrices(past_frame_matrix, this.#INIT_MATRIX)

        this.rotation_matrix[0] = [(this.#cosYaw * this.#cosPitch), ((this.#cosYaw * this.#sinPitch * this.#sinRoll) - (this.#sinYaw * this.#cosRoll)), ((this.#cosYaw * this.#sinPitch * this.#cosRoll) + (this.#sinYaw * this.#sinRoll))];
        this.rotation_matrix[1] = [(this.#sinYaw * this.#cosPitch), ((this.#sinYaw * this.#sinPitch * this.#sinRoll) + (this.#cosYaw * this.#cosRoll)), ((this.#sinYaw * this.#sinPitch * this.#cosRoll) - (this.#cosYaw * this.#sinRoll))];
        this.rotation_matrix[2] = [-this.#sinPitch, (this.#cosPitch * this.#sinRoll), (this.#cosPitch * this.#cosRoll)];
        
        this.rotation_matrix = this.#multiplyMatrices(past_frame_matrix, this.rotation_matrix);
        this.#VECTOR_LINK.updateVector(newX, newY, newZ, this.rotation_matrix);
        this.new_x_line_vector = this.#multiplyVectorMatrix(this.x_l_vector, this.rotation_matrix);
        this.new_x_cone_vector = this.#multiplyVectorMatrix(this.x_c_vector, this.rotation_matrix);
        this.new_y_line_vector = this.#multiplyVectorMatrix(this.y_l_vector, this.rotation_matrix);
        this.new_y_cone_vector = this.#multiplyVectorMatrix(this.y_c_vector, this.rotation_matrix);
        this.new_z_line_vector = this.#multiplyVectorMatrix(this.z_l_vector, this.rotation_matrix);
        this.new_z_cone_vector = this.#multiplyVectorMatrix(this.z_c_vector, this.rotation_matrix);
        
        this.#update3DStructure(this.new_x_line_vector, this.new_x_cone_vector);
        this.#update3DStructure(this.new_y_line_vector, this.new_y_cone_vector, 1);
        this.#update3DStructure(this.new_z_line_vector, this.new_z_cone_vector, 2);
        
        return [this.rotation_matrix, this.#VECTOR_LINK.rotated_line_vector_tip];
    }

    get3DStructures(buffer, show_frame){
        if(show_frame){buffer.push(this.X_AXIS_CONE, this.X_AXIS_LINE, this.Y_AXIS_CONE, this.Y_AXIS_LINE, this.Z_AXIS_CONE, this.Z_AXIS_LINE, this.#VECTOR_LINK.VECTOR_AXIS_LINE);}
        else{
            buffer.push(this.#VECTOR_LINK.VECTOR_AXIS_LINE);
        }
    }

    #multiplyVectorMatrix(vector, matrix){
        let result_vector = [0, 0, 0];
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                result_vector[i] += matrix[i][j] * vector[j];
            }
        }
        return result_vector;
    };

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

    #update3DStructure(new_line_vector, new_cone_vector, axis = 0){  // 0 -> update X axis, 1 -> update Y axis and 2 -> update Z axis
        this.#DATA_HOLDER = [0, 0];
        this.#DATA_HOLDER[0] = ((axis === 0 ? this.X_AXIS_LINE : ( axis === 1 ? this.Y_AXIS_LINE : ( axis === 2 ? this.Z_AXIS_LINE : null))));
        this.#DATA_HOLDER[1] = ((axis === 0 ? this.X_AXIS_CONE : ( axis === 1 ? this.Y_AXIS_CONE : ( axis === 2 ? this.Z_AXIS_CONE : null))));

        this.#DATA_HOLDER[0].x = [this.xyz[0], new_line_vector[0] + this.xyz[0]];
        this.#DATA_HOLDER[0].y = [this.xyz[1], new_line_vector[1] + this.xyz[1]];
        this.#DATA_HOLDER[0].z = [this.xyz[2], new_line_vector[2] + this.xyz[2]];
             
        this.#DATA_HOLDER[1].x = [new_cone_vector[0] + this.xyz[0]];
        this.#DATA_HOLDER[1].y = [new_cone_vector[1] + this.xyz[1]];
        this.#DATA_HOLDER[1].z = [new_cone_vector[2] + this.xyz[2]];
        this.#DATA_HOLDER[1].u = [new_cone_vector[0]];
        this.#DATA_HOLDER[1].v = [new_cone_vector[1]];
        this.#DATA_HOLDER[1].w = [new_cone_vector[2]];         
    };
}