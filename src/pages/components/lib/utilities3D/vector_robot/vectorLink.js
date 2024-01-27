export default class VECTOR_LINK {
    // Private locations

    // Private Constants
    #INIT_MATRIX;
    #VECTOR_AXIS_COLOR = "cyan";
    #LINE_WIDTH = 7;
    #LINE_AXIS_LENGTH = 4.0;

    // Public Variables
    rotation_matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    line_vector;
    rotated_line_vector;
    rotated_line_vector_tip = [0, 0, 0];

    // 3D frame elements declaration:
    VECTOR_AXIS_LINE = {
        name: "vector",
        showlegend: false,
        mode: "lines",
        type: "scatter3d",
        hoverinfo: "true",
        x: [0, 0],
        y: [0, 0],
        z: [0, 0],
        line: {
            color: this.#VECTOR_AXIS_COLOR,
            width: this.#LINE_WIDTH
        }
    };

    constructor(x, y, z, init_matrix, vector_length, color = "cyan"){ // Angles in radians
        this.xyz = [x, y, z];
        this.#LINE_AXIS_LENGTH = vector_length;
        this.line_vector = [this.#LINE_AXIS_LENGTH, 0, 0];
        this.#VECTOR_AXIS_COLOR = color;
        this.VECTOR_AXIS_LINE.line.color = this.#VECTOR_AXIS_COLOR;
        this.#INIT_MATRIX = init_matrix;

        this.updateVector(this.xyz[0], this.xyz[1], this.xyz[2], this.#INIT_MATRIX, true);
    };

    reinitializeVector(x, y, z, init_matrix, vector_length, color = "cyan"){
        this.xyz = [x, y, z];
        this.#LINE_AXIS_LENGTH = vector_length;
        this.line_vector = [this.#LINE_AXIS_LENGTH, 0, 0];
        this.#VECTOR_AXIS_COLOR = color;
        this.VECTOR_AXIS_LINE.line.color = this.#VECTOR_AXIS_COLOR;
        this.#INIT_MATRIX = init_matrix;

        this.updateVector(this.xyz[0], this.xyz[1], this.xyz[2], this.#INIT_MATRIX, true);
    }

    // Angles in radians
    updateVector(newX, newY, newZ, rotation_matrix, initialization = false){
        this.xyz = [newX, newY, newZ];
        
        this.rotated_line_vector = this.#multiplyVectorMatrix(this.line_vector, rotation_matrix);
        
        if(initialization)this.line_vector = this.rotated_line_vector;
        
        this.#update3DStructure(this.rotated_line_vector);    
        
        return this.rotated_line_vector_tip;
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

    #update3DStructure(new_line_vector){
        this.rotated_line_vector_tip[0] = new_line_vector[0] + this.xyz[0];
        this.rotated_line_vector_tip[1] = new_line_vector[1] + this.xyz[1];
        this.rotated_line_vector_tip[2] = new_line_vector[2] + this.xyz[2];

        this.VECTOR_AXIS_LINE.x = [this.xyz[0], this.rotated_line_vector_tip[0]];
        this.VECTOR_AXIS_LINE.y = [this.xyz[1], this.rotated_line_vector_tip[1]];
        this.VECTOR_AXIS_LINE.z = [this.xyz[2], this.rotated_line_vector_tip[2]];         
    };
}