export const upowerEnumerate = `upower -e`;

export const upowerEnumerateOutput = `/org/freedesktop/UPower/devices/battery_BAT0
/org/freedesktop/UPower/devices/line_power_ADP0
/org/freedesktop/UPower/devices/DisplayDevice`;

export const upowerInfo = `upower -i /org/freedesktop/UPower/devices/battery_BAT0`;

export const upowerInfoOutput = `native-path:          BAT0
vendor:               AS3GYFG3KC
model:                R220358
serial:               42D4
power supply:         yes
updated:              Sat 14 Feb 2026 08:12:58 AM +01 (7 seconds ago)
has history:          yes
has statistics:       yes
battery
    present:             yes
    rechargeable:        yes
    state:               pending-charge
    warning-level:       none
    energy:              60.721 Wh
    energy-empty:        0 Wh
    energy-full:         75.901 Wh
    energy-full-design:  90.001 Wh
    energy-rate:         0 W
    voltage:             16.427 V
    charge-cycles:       N/A
    percentage:          80%
    capacity:            84.3335%
    icon-name:           'battery-full-charging-symbolic'`;
