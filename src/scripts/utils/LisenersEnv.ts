import { CONFIG, resetSimulation } from "../index";

export function initListners() {
    // Ordonencement Algorithme
    $(document).on("click", 'input[name="ordo"]', function () {
        $('input[name="ordo"]').not(this).prop("checked", false);
        CONFIG.ordonencement = this.value;
    });

    // Politique ralentie
    $(document).on("click", 'input[name="poliR"]', function () {
        $('input[name="poliR"]').not(this).prop("checked", false);
        CONFIG.politiqueR = this.value;
    });

    // Nombre elevator
    $("#ElevatorRange").on("change", function () {
        //@ts-ignore
        CONFIG.elevator = parseInt($("#ElevatorRange").val());
    });

    // Nombre etages
    $("#FloorRange").on("change", function () {
        //@ts-ignore
        CONFIG.floor = parseInt($("#FloorRange").val());
        console.log(CONFIG);
    });

    $("#resetSimulation").on("click", () => {
        resetSimulation();
    });
}
