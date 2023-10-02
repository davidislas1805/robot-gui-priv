import JOINT_FRAME from "./jointFrame";

export default class ROBOT_ARM{
    // Private variables:
    #SHOW_JOINT_FRAMES = [true, false, false, false, false, false, true];//[true, true, true, true, true, true, true];
    #render_data_array;
    #link_lengths = [5, 10, 5, 7, 6, 9];
    #links_origins = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
    #base_link_rotation_matrix;
    #link_one_rotation_matrix;
    #link_two_rotation_matrix;
    #link_three_rotation_matrix;
    #link_four_rotation_matrix;
    #link_five_rotation_matrix;

    // Private Objects:
    #BASE_LINK_FRAME = new JOINT_FRAME(0, 0, 0, 0, 0, 0, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], this.#link_lengths[0], "z");
    #LINK_ONE_FRAME = new JOINT_FRAME(0, 0, 0, 0, 0, 0, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], this.#link_lengths[1], "x", "orange");
    #LINK_TWO_FRAME = new JOINT_FRAME(0, 0, 0, 0, 0, 0, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], this.#link_lengths[2], "x", "purple");
    #LINK_THREE_FRAME = new JOINT_FRAME(0, 0, 0, 0, 0, 0, [[0, 0, 1], [0, 1, 0], [-1, 0, 0]], this.#link_lengths[3], "z", "pink");
    #LINK_FOUR_FRAME = new JOINT_FRAME(0, 0, 0, 0, 0, 0, [[0, 0, -1], [0, 1, 0], [1, 0, 0]], this.#link_lengths[4], "x", "dark blue");
    #LINK_FIVE_FRAME = new JOINT_FRAME(0, 0, 0, 0, 0, 0, [[0, 0, 1], [0, 1, 0], [-1, 0, 0]], this.#link_lengths[5], "z", "dark green");
    #END_EFFECTOR_FRAME = new JOINT_FRAME(0, 0, 0, 0, 0, 0, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 0, "z", "dark green");
    
    constructor(link_lengths){
        for (let i = 0; i < 6; i++){
            this.#link_lengths[i] = link_lengths[i];
        };

        this.#BASE_LINK_FRAME.setLinkLength(0, 0, 0, 0, 0, 0, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], this.#link_lengths[0], "z");
        this.#LINK_ONE_FRAME.setLinkLength(0, 0, 0, 0, 0, 0, [[1, 0, 0], [0, 0, -1], [0, 1, 0]], this.#link_lengths[1], "x", "orange");
        this.#LINK_TWO_FRAME.setLinkLength(0, 0, 0, 0, 0, 0, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], this.#link_lengths[2], "x", "purple");
        this.#LINK_THREE_FRAME.setLinkLength(0, 0, 0, 0, 0, 0, [[0, 0, 1], [0, 1, 0], [-1, 0, 0]], this.#link_lengths[3], "z", "pink");
        this.#LINK_FOUR_FRAME.setLinkLength(0, 0, 0, 0, 0, 0, [[0, 0, -1], [0, 1, 0], [1, 0, 0]], this.#link_lengths[4], "x", "dark blue");
        this.#LINK_FIVE_FRAME.setLinkLength(0, 0, 0, 0, 0, 0, [[0, 0, 1], [0, 1, 0], [-1, 0, 0]], this.#link_lengths[5], "z", "dark green");
        this.#END_EFFECTOR_FRAME.setLinkLength(0, 0, 0, 0, 0, 0, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 0, "z", "dark green");

        this.updateJoints([0, 0, 0, 0, 0, 0]);
        
    };

    showJointFrames(show){
        this.#SHOW_JOINT_FRAMES = show;
    }

    updateJoints(angles_array = Array){
        this.#render_data_array = [];  // Attach world frame
        
        [this.#base_link_rotation_matrix, this.#links_origins[0]] = this.#updateJointFrames([0, 0, 0], [0, 0, angles_array[0]], this.#BASE_LINK_FRAME, [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        
        [this.#link_one_rotation_matrix, this.#links_origins[1]] = this.#updateJointFrames(this.#links_origins[0], [0, 0, angles_array[1]], this.#LINK_ONE_FRAME, this.#base_link_rotation_matrix, 1);
        
        [this.#link_two_rotation_matrix, this.#links_origins[2]] = this.#updateJointFrames(this.#links_origins[1], [0, 0, angles_array[2]], this.#LINK_TWO_FRAME, this.#link_one_rotation_matrix, 2);
        
        [this.#link_three_rotation_matrix, this.#links_origins[3]] = this.#updateJointFrames(this.#links_origins[2], [0, 0, angles_array[3]], this.#LINK_THREE_FRAME, this.#link_two_rotation_matrix, 3);
        
        [this.#link_four_rotation_matrix, this.#links_origins[4]] = this.#updateJointFrames(this.#links_origins[3], [0, 0, angles_array[4]], this.#LINK_FOUR_FRAME, this.#link_three_rotation_matrix, 4);

        [this.#link_five_rotation_matrix, this.#links_origins[5]] = this.#updateJointFrames(this.#links_origins[4], [0, 0, angles_array[5]], this.#LINK_FIVE_FRAME, this.#link_four_rotation_matrix, 5);
        this.#updateJointFrames(this.#links_origins[5], [0, 0, 0], this.#END_EFFECTOR_FRAME, this.#link_five_rotation_matrix, 6);
        
        // console.table(this.#LINK_THREE_FRAME.rotation_matrix);
        // console.table(this.#END_EFFECTOR_FRAME.rotation_matrix);
        return this.#links_origins[5];
    };

    renderArm(){
        return this.#render_data_array;
    };

    #updateJointFrames(xyz, euler = Array, JOINT_FRAME_OOP, matrix, FRAME_INDEX = 0){
        let rotation_matrix_buffer, next_frame_origin; 
        [rotation_matrix_buffer, next_frame_origin] = JOINT_FRAME_OOP.updateFrame(xyz[0], xyz[1], xyz[2], euler[0], euler[1], euler[2], matrix);
        JOINT_FRAME_OOP.get3DStructures(this.#render_data_array, this.#SHOW_JOINT_FRAMES[FRAME_INDEX]);
        return [rotation_matrix_buffer, next_frame_origin];
    };
};