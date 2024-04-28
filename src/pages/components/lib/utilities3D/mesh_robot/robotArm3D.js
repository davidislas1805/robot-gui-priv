import FRAME from "./frame";
import MESH3D_LINK from "./mesh3DLink";

/**
 * Upgrade from the vector only robot, this version renders a 3D mesh. Some internal changes were made to the internal elements
 * but the overal performance remained the same.
 */

export default class ROBOT_ARM_3D{
    // Private constants
    #LINKS_WIDTHS = 1;

    // Private variables
    #show_joint_frames = [true, false, false, false, false, false, true];
    #links_origins = [[0, 0, 0], [0, 0, 5], [10, 0, 5], [15, 0, 5], [15, 0, 5], [15, 0, 5], [17, 0, 5]];
    #link_lengths = [5, 10, 5, 0, 0, 2];
    #base_link_rotation_matrix = [];
    #link_1_rotation_matrix = [];
    #link_2_rotation_matrix = [];
    #link_3_rotation_matrix = [];
    #link_4_rotation_matrix = [];
    #link_5_rotation_matrix = [];

    // Private Joint Objects
    #JOINT_BASE = new MESH3D_LINK(this.#link_lengths[0], 1, this.#links_origins[0], [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    #JOINT_1 = new MESH3D_LINK(this.#link_lengths[1], 1, this.#links_origins[1], [[1, 0, 0], [0, 0, -1], [0, 1, 0]], false);
    #JOINT_2 = new MESH3D_LINK(this.#link_lengths[2], 1, this.#links_origins[2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], false);
    #JOINT_3 = new MESH3D_LINK(this.#link_lengths[3], 1, this.#links_origins[3], [[0, 0, 1], [0, 1, 0], [-1, 0, 0]]);
    #JOINT_4 = new MESH3D_LINK(this.#link_lengths[4], 1, this.#links_origins[4], [[0, 0, -1], [0, 1, 0], [1, 0, 0]], false);
    #JOINT_5 = new MESH3D_LINK(this.#link_lengths[5], 1, this.#links_origins[5], [[0, 0, 1], [0, 1, 0], [-1, 0, 0]], true);

    // Private Joint Frames Objects
    #JOINT_BASE_FRAME = new FRAME(this.#links_origins[0], [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    #JOINT_1_FRAME = new FRAME(this.#links_origins[1], [[1, 0, 0], [0, 0, -1], [0, 1, 0]]);
    #JOINT_2_FRAME = new FRAME(this.#links_origins[2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    #JOINT_3_FRAME = new FRAME(this.#links_origins[3], [[0, 0, 1], [0, 1, 0], [-1, 0, 0]]);
    #JOINT_4_FRAME = new FRAME(this.#links_origins[4], [[0, 0, -1], [0, 1, 0], [1, 0, 0]]);
    #JOINT_5_FRAME = new FRAME(this.#links_origins[5], [[0, 0, 1], [0, 1, 0], [-1, 0, 0]]);
    #TCP_FRAME = new FRAME(this.#links_origins[6], [[0, 0, 1], [0, 1, 0], [-1, 0, 0]]);

    /** Initialize the robot
     * 
     * @param {Array} robot_link_lengths 
     * corresponding lengths to each link of the robot
     */
    constructor(robot_link_lengths){
        this.#link_lengths = robot_link_lengths;

        this.#links_origins = [
            [0, 0, 0],
            [0, 0, this.#link_lengths[0]],
            [this.#link_lengths[1], 0, this.#link_lengths[0]],
            [this.#link_lengths[1] + this.#link_lengths[2], 0, this.#link_lengths[0]],
            [this.#link_lengths[1] + this.#link_lengths[2], 0, this.#link_lengths[0]],
            [this.#link_lengths[1] + this.#link_lengths[2], 0, this.#link_lengths[0]]
        ];

        this.#JOINT_BASE.reinitializeLink(this.#link_lengths[0], this.#LINKS_WIDTHS, this.#links_origins[0], [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        this.#JOINT_1.reinitializeLink(this.#link_lengths[1], this.#LINKS_WIDTHS, this.#links_origins[1], [[1, 0, 0], [0, 0, -1], [0, 1, 0]], false);
        this.#JOINT_2.reinitializeLink(this.#link_lengths[2], this.#LINKS_WIDTHS, this.#links_origins[2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], false);
        this.#JOINT_3.reinitializeLink(this.#link_lengths[3], this.#LINKS_WIDTHS, this.#links_origins[3], [[0, 0, 1], [0, 1, 0], [-1, 0, 0]]);
        this.#JOINT_4.reinitializeLink(this.#link_lengths[4], this.#LINKS_WIDTHS, this.#links_origins[4], [[0, 0, -1], [0, 1, 0], [1, 0, 0]], false);
        this.#JOINT_5.reinitializeLink(this.#link_lengths[5], this.#LINKS_WIDTHS, this.#links_origins[5], [[0, 0, 1], [0, 1, 0], [-1, 0, 0]], true);

        this.updateRobotArm([0, 0, 0, 0, 0, 0]);
    };

    /** Update the joints of the robot with the given angles.
     * 
     * @param {Array} new_joint_angles array with the new angles for each joint [rad]
     * @returns The Tool Center Point cartesian coordinates
     */
    updateRobotArm(new_joint_angles){
        [this.#base_link_rotation_matrix, this.#links_origins[1]] = this.#JOINT_BASE.rotateAtranslateLink(this.#links_origins[0], this.#getRz(new_joint_angles[0]), [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        [this.#link_1_rotation_matrix, this.#links_origins[2]] = this.#JOINT_1.rotateAtranslateLink(this.#links_origins[1], this.#getRz(new_joint_angles[1]), this.#base_link_rotation_matrix);
        [this.#link_2_rotation_matrix, this.#links_origins[3]] = this.#JOINT_2.rotateAtranslateLink(this.#links_origins[2], this.#getRz(new_joint_angles[2]), this.#link_1_rotation_matrix);
        [this.#link_3_rotation_matrix, this.#links_origins[4]] = this.#JOINT_3.rotateAtranslateLink(this.#links_origins[3], this.#getRz(new_joint_angles[3]), this.#link_2_rotation_matrix);
        [this.#link_4_rotation_matrix, this.#links_origins[5]] = this.#JOINT_4.rotateAtranslateLink(this.#links_origins[4], this.#getRz(new_joint_angles[4]), this.#link_3_rotation_matrix);
        [this.#link_5_rotation_matrix, this.#links_origins[6]] = this.#JOINT_5.rotateAtranslateLink(this.#links_origins[5], this.#getRz(new_joint_angles[5]), this.#link_4_rotation_matrix);

        if(this.#show_joint_frames[0])this.#JOINT_BASE_FRAME.updateFrame(this.#links_origins[0], this.#base_link_rotation_matrix);
        if(this.#show_joint_frames[1])this.#JOINT_1_FRAME.updateFrame(this.#links_origins[1], this.#link_1_rotation_matrix);
        if(this.#show_joint_frames[2])this.#JOINT_2_FRAME.updateFrame(this.#links_origins[2], this.#link_2_rotation_matrix);
        if(this.#show_joint_frames[3])this.#JOINT_3_FRAME.updateFrame(this.#links_origins[3], this.#link_3_rotation_matrix);
        if(this.#show_joint_frames[4])this.#JOINT_4_FRAME.updateFrame(this.#links_origins[4], this.#link_4_rotation_matrix);
        if(this.#show_joint_frames[5])this.#JOINT_5_FRAME.updateFrame(this.#links_origins[5], this.#link_5_rotation_matrix);
        if(this.#show_joint_frames[6])this.#TCP_FRAME.updateFrame(this.#links_origins[6], this.#link_5_rotation_matrix);

        return this.#links_origins[6];
    };

    /** Toggle whether to show the coordinate frame for each joint or not.
     * 
     * @param {Array} new_show_frames Array of booleans
     */
    showFrames(new_show_frames){
        this.#show_joint_frames = new_show_frames;
    }

    /** Get the TCP rotation matrix given the joint values
     * 
     * @returns Rotation Matrix of TCP
     */
    getTCPMatrix(){
        return this.#link_5_rotation_matrix;
    }

    /** Returns an array containing the 3D data structures of each part of the robot.
     * 
     * @returns 
     */
    renderArm(){
        let local_3d_structure_buffer = [];
        this.#JOINT_BASE.get3DMesh(local_3d_structure_buffer);
        this.#JOINT_1.get3DMesh(local_3d_structure_buffer);
        this.#JOINT_2.get3DMesh(local_3d_structure_buffer);
        this.#JOINT_3.get3DMesh(local_3d_structure_buffer);
        this.#JOINT_4.get3DMesh(local_3d_structure_buffer);
        this.#JOINT_5.get3DMesh(local_3d_structure_buffer);

        if(this.#show_joint_frames[0])this.#JOINT_BASE_FRAME.get3DStructures(local_3d_structure_buffer);
        if(this.#show_joint_frames[1])this.#JOINT_1_FRAME.get3DStructures(local_3d_structure_buffer);
        if(this.#show_joint_frames[2])this.#JOINT_2_FRAME.get3DStructures(local_3d_structure_buffer);
        if(this.#show_joint_frames[3])this.#JOINT_3_FRAME.get3DStructures(local_3d_structure_buffer);
        if(this.#show_joint_frames[4])this.#JOINT_4_FRAME.get3DStructures(local_3d_structure_buffer);
        if(this.#show_joint_frames[5])this.#JOINT_5_FRAME.get3DStructures(local_3d_structure_buffer);
        if(this.#show_joint_frames[6])this.#TCP_FRAME.get3DStructures(local_3d_structure_buffer);
        
        return local_3d_structure_buffer;
    }
    
    /**
     * Given an angle, a rotation matrix around the Z-axis is computed
     * @param {*} theta angle of rotation [rad]
     * @returns Rotation matrix of the angle around z
     */
    #getRz(theta){
        let rz_matrix =[
            [Math.cos(theta), -Math.sin(theta), 0],
            [Math.sin(theta), Math.cos(theta), 0],
            [0, 0, 1]
        ]
        return rz_matrix;
    };
}