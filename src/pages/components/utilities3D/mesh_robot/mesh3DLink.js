export default class MESH3D_LINK {
    // Private variables
    #LINK_VECTOR = [];
    #SQUARE_VECTORS = [];
    #HEX_VECTORS = [];
    #LOCAL_LINK_FRAME = [];
    #height = 1;
    #width = 1;
    #link_origins = [0, 0, 0];
    #JOINT_APOTHEM = 1.25;
    #joint_length = 1;
    #LINK_COLOR;
    #HEX_JOINT_COLOR;
    #FACE_COLOR = [];
    #HEX_COLOR = [];
    #LINK_INIT_MATRIX = [[0, 0, 1], [0, 1, 0], [-1, 0, 0]];

    #LINK_3D_STRUCTURE = {
        type: "mesh3d",
        hoverinfo: "skip",
        x: [0, 0, 0, 0, 0, 0, 0, 0],
        y: [0, 0, 0, 0, 0, 0, 0, 0],
        z: [0, 0, 0, 0, 0, 0, 0, 0],
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        facecolor: this.#FACE_COLOR,
        "flatshading": true,
        "lighting": {"facenormalsepsilon": 0 }
    };

    #LINK_HEX_JOINT_STRUCTURE = {
        type: "mesh3d",
        hoverinfo: "skip",
        x: [0, 0, 0, 0, 0, 0, 0, 0],
        y: [0, 0, 0, 0, 0, 0, 0, 0],
        z: [0, 0, 0, 0, 0, 0, 0, 0],
        i: [0, 0, 6, 4, 6, 0, 8, 8, 14, 12, 14, 8, 0, 9, 1, 10, 2, 11, 3, 12, 4, 13, 5, 14, 6, 15, 7, 0],
        j: [1, 7, 5, 3, 4, 4, 9, 15, 13, 11, 12, 12, 8, 1, 9, 2, 10, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15, 8],
        k: [2, 6, 4, 2, 0, 2, 10, 14, 12, 10, 8, 10, 9, 0, 10, 1, 11, 2, 12, 3, 13, 4, 14, 5, 15, 6, 0, 15],
        facecolor: this.#HEX_COLOR,
        "flatshading": true,
        "lighting": {"facenormalsepsilon": 0 }
    };

    constructor(link_height, link_width, origins, base_link_frame, link_along_z = true, link_color = 'grey', joint_color = "purple"){
        this.#link_origins = origins;
        this.#LINK_COLOR = link_color;
        this.#HEX_JOINT_COLOR = joint_color;
        this.#LOCAL_LINK_FRAME = base_link_frame;
        
        if(link_along_z){
            this.#height = (link_height / 2);
            this.#width = link_width;
            this.#joint_length = (this.#height !== 0 ? link_height / 4 : 0.25);
            this.#LINK_INIT_MATRIX = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        } else {
            this.#height = link_height;
            this.#width = link_width;
            this.#joint_length = (this.#height !== 0 ? 1.25 : 0.25);
            this.#LINK_INIT_MATRIX = [[0, 0, 1], [0, 1, 0], [-1, 0, 0]];
        }
        
        this.#LINK_VECTOR = [0, 0, link_height];

        let INIT_MATRIX = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

        for(let i = 0; i < 28; i++){
            if(i < 12 && this.#height !== 0)this.#FACE_COLOR.push(this.#LINK_COLOR);
            this.#HEX_COLOR.push(this.#HEX_JOINT_COLOR);
        }

        if(this.#height !== 0){
            this.#SQUARE_VECTORS = [
                [ - (this.#width / 2), - (this.#width / 2), ( link_along_z ? this.#height : 0)],
                [ - (this.#width / 2), + (this.#width / 2), ( link_along_z ? this.#height : 0)],
                [ + (this.#width / 2), + (this.#width / 2), ( link_along_z ? this.#height : 0)],
                [ + (this.#width / 2), - (this.#width / 2), ( link_along_z ? this.#height : 0)],
                [ - (this.#width / 2), - (this.#width / 2), ( link_along_z ? 2 : 1) * this.#height],
                [ - (this.#width / 2), + (this.#width / 2), ( link_along_z ? 2 : 1) * this.#height],
                [ + (this.#width / 2), + (this.#width / 2), ( link_along_z ? 2 : 1) * this.#height],
                [ + (this.#width / 2), - (this.#width / 2), ( link_along_z ? 2 : 1) * this.#height]
            ];
        } else {
            this.#LINK_3D_STRUCTURE = null;
        }

        for(let j = 0; j < 2; j++){
            let cylinder_height = (j === 0 ? (-this.#joint_length) : (this.#joint_length));
            let TH = (Math.PI / 4);
            let cosTH = Math.cos(TH);
            let sinTH = Math.sin(TH);
            
            for(let i = 0; i < 8; i++){
                this.#HEX_VECTORS.push([this.#JOINT_APOTHEM * cosTH, this.#JOINT_APOTHEM * sinTH, cylinder_height + (( link_along_z) ? this.#joint_length : 0)]);

                TH += (Math.PI / 4);
                cosTH = Math.cos(TH);
                sinTH = Math.sin(TH);
            }
        }
    
        this.rotateAtranslateLink(this.#link_origins, INIT_MATRIX);
    }

    reinitializeLink(link_height, link_width, origins, base_link_frame, link_along_z = true, link_color = 'grey', joint_color = "purple"){
        this.#link_origins = origins;
        this.#LINK_COLOR = link_color;
        this.#HEX_JOINT_COLOR = joint_color;
        this.#LOCAL_LINK_FRAME = base_link_frame;
        
        if(link_along_z){
            this.#height = (link_height / 2);
            this.#width = link_width;
            this.#joint_length = (this.#height !== 0 ? link_height / 4 : 0.25);
            this.#LINK_INIT_MATRIX = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        } else {
            this.#height = link_height;
            this.#width = link_width;
            this.#joint_length = (this.#height !== 0 ? 1.25 : 0.25);
            this.#LINK_INIT_MATRIX = [[0, 0, 1], [0, 1, 0], [-1, 0, 0]];
        }
        
        this.#LINK_VECTOR = [0, 0, link_height];

        let INIT_MATRIX = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

        for(let i = 0; i < 28; i++){
            if(i < 12 && this.#height !== 0)this.#FACE_COLOR.push(this.#LINK_COLOR);
            this.#HEX_COLOR.push(this.#HEX_JOINT_COLOR);
        }

        if(this.#height !== 0){
            this.#SQUARE_VECTORS = [
                [ - (this.#width / 2), - (this.#width / 2), ( link_along_z ? this.#height : 0)],
                [ - (this.#width / 2), + (this.#width / 2), ( link_along_z ? this.#height : 0)],
                [ + (this.#width / 2), + (this.#width / 2), ( link_along_z ? this.#height : 0)],
                [ + (this.#width / 2), - (this.#width / 2), ( link_along_z ? this.#height : 0)],
                [ - (this.#width / 2), - (this.#width / 2), ( link_along_z ? 2 : 1) * this.#height],
                [ - (this.#width / 2), + (this.#width / 2), ( link_along_z ? 2 : 1) * this.#height],
                [ + (this.#width / 2), + (this.#width / 2), ( link_along_z ? 2 : 1) * this.#height],
                [ + (this.#width / 2), - (this.#width / 2), ( link_along_z ? 2 : 1) * this.#height]
            ];
        } else {
            this.#LINK_3D_STRUCTURE = null;
        }

        for(let j = 0; j < 2; j++){
            let cylinder_height = (j === 0 ? (-this.#joint_length) : (this.#joint_length));
            let TH = (Math.PI / 4);
            let cosTH = Math.cos(TH);
            let sinTH = Math.sin(TH);
            
            for(let i = 0; i < 8; i++){
                this.#HEX_VECTORS.push([this.#JOINT_APOTHEM * cosTH, this.#JOINT_APOTHEM * sinTH, cylinder_height + (( link_along_z) ? this.#joint_length : 0)]);

                TH += (Math.PI / 4);
                cosTH = Math.cos(TH);
                sinTH = Math.sin(TH);
            }
        }
    
        this.rotateAtranslateLink(this.#link_origins, INIT_MATRIX);
    }

    rotateAtranslateLink(new_vlink_origin, rotation_matrix = [], new_local_link_frame = null){
        let new_rotated_link_vector = [];
        let new_rotated_joint_vector = [];
        this.#link_origins = new_vlink_origin;
        let temp_local_link_frame = ( new_local_link_frame === null ? this.#LOCAL_LINK_FRAME : this.#multiplyMatrices(new_local_link_frame, this.#LOCAL_LINK_FRAME));
        temp_local_link_frame = this.#multiplyMatrices(temp_local_link_frame, rotation_matrix)
        for(let i = 0; i < 16; i++){
            if(i < 8 && this.#height !== 0)new_rotated_link_vector[i] = this.#multiplyVectorMatrix(this.#SQUARE_VECTORS[i], this.#multiplyMatrices(temp_local_link_frame, this.#LINK_INIT_MATRIX));
            new_rotated_joint_vector[i] = this.#multiplyVectorMatrix(this.#HEX_VECTORS[i], temp_local_link_frame); 
        }

        for(let i = 0; i < 16; i++){
            if(i < 8 && this.#height !== 0){
                new_rotated_link_vector[i][0] += this.#link_origins[0];
                new_rotated_link_vector[i][1] += this.#link_origins[1];
                new_rotated_link_vector[i][2] += this.#link_origins[2];
            };
            new_rotated_joint_vector[i][0] += this.#link_origins[0];
            new_rotated_joint_vector[i][1] += this.#link_origins[1];
            new_rotated_joint_vector[i][2] += this.#link_origins[2];
        }
        this.#update3DStructure(new_rotated_link_vector, new_rotated_joint_vector);

        let new_rotated_linkvector = this.#multiplyVectorMatrix(this.#LINK_VECTOR, this.#multiplyMatrices(temp_local_link_frame, this.#LINK_INIT_MATRIX));

        new_rotated_linkvector[0] += this.#link_origins[0];
        new_rotated_linkvector[1] += this.#link_origins[1];
        new_rotated_linkvector[2] += this.#link_origins[2];

        return [temp_local_link_frame, new_rotated_linkvector];
    }

    get3DMesh(buffer){
        if(this.#height !== 0)buffer.push(this.#LINK_3D_STRUCTURE, this.#LINK_HEX_JOINT_STRUCTURE);
        buffer.push(this.#LINK_HEX_JOINT_STRUCTURE);
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

    #update3DStructure(new_vector_matrix, new_cylinder_vector_matrix){
        this.#LINK_HEX_JOINT_STRUCTURE.x = [];
        this.#LINK_HEX_JOINT_STRUCTURE.y = [];
        this.#LINK_HEX_JOINT_STRUCTURE.z = [];
        if (this.#height !== 0){    
            this.#LINK_3D_STRUCTURE.x = [];
            this.#LINK_3D_STRUCTURE.y = [];
            this.#LINK_3D_STRUCTURE.z = [];
        }

        for(let i = 0; i < 16; i++){
            if(i < 8 && this.#height !== 0){
                this.#LINK_3D_STRUCTURE.x.push(new_vector_matrix[i][0]);
                this.#LINK_3D_STRUCTURE.y.push(new_vector_matrix[i][1]);
                this.#LINK_3D_STRUCTURE.z.push(new_vector_matrix[i][2]);
            }
            this.#LINK_HEX_JOINT_STRUCTURE.x.push(new_cylinder_vector_matrix[i][0]);
            this.#LINK_HEX_JOINT_STRUCTURE.y.push(new_cylinder_vector_matrix[i][1]);
            this.#LINK_HEX_JOINT_STRUCTURE.z.push(new_cylinder_vector_matrix[i][2]);
        };
    }
}