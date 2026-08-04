local savedHair

RegisterNUICallback('jrmyToggleHair', function(_, cb)
    cb(1)

    local ped = cache.ped or PlayerPedId()

    if savedHair then
        SetPedComponentVariation(ped, 2, savedHair.drawable, savedHair.texture, 0)
        savedHair = nil
    else
        savedHair = {
            drawable = GetPedDrawableVariation(ped, 2),
            texture = GetPedTextureVariation(ped, 2),
        }
        SetPedComponentVariation(ped, 2, 0, 0, 0)
    end
end)

RegisterNUICallback('jrmyOpenEditor', function(_, cb)
    cb(1)
    exports.ox_inventory:closeInventory()
    CreateThread(function()
        Wait(200)
        ActivateRockstarEditor()
    end)
end)

local COMPONENTS = { mask = 1, neck = 7, top = 11, vest = 9, torso = 3, bag = 5, gloves = 3, pants = 4, shoes = 6 }
local PROPS = { hat = 0, glasses = 1, watch = 6 }
local EMPTY = { [1] = 0, [3] = 15, [4] = 61, [5] = 0, [6] = 34, [7] = 0, [9] = 0, [11] = 15 }
local ANIM = {
    hat = { dict = 'clothingprops', name = 'take_off', wait = 500 },
    glasses = { dict = 'clothingspecs', name = 'take_off', wait = 500 },
    watch = { dict = 'clothingtie', name = 'try_tie_positive_a', wait = 700 },
    mask = { dict = 'clothingprops', name = 'take_off', wait = 500 },
    neck = { dict = 'clothingtie', name = 'try_tie_positive_a', wait = 700 },
    top = { dict = 'clothingshirt', name = 'try_shirt_positive_d', wait = 800 },
    vest = { dict = 'clothingshirt', name = 'try_shirt_positive_d', wait = 800 },
    torso = { dict = 'clothingshirt', name = 'try_shirt_positive_d', wait = 800 },
    gloves = { dict = 'clothingshirt', name = 'try_shirt_positive_d', wait = 800 },
    bag = { dict = 'clothingshirt', name = 'try_shirt_positive_d', wait = 800 },
    pants = { dict = 'clothingtrousers', name = 'try_trousers_positive_a', wait = 900 },
    shoes = { dict = 'clothingshoes', name = 'try_shoes_positive_a', wait = 900 },
}
local savedClothing = {}
local clothingBusy = false

local function playDressAnim(piece)
    local a = ANIM[piece]
    if not a then return 0 end
    RequestAnimDict(a.dict)
    local tries = 0
    while not HasAnimDictLoaded(a.dict) and tries < 50 do
        Wait(20)
        tries = tries + 1
    end
    if not HasAnimDictLoaded(a.dict) then return 0 end
    TaskPlayAnim(cache.ped or PlayerPedId(), a.dict, a.name, 3.0, 3.0, -1, 49, 0, false, false, false)
    return a.wait
end

local function stopDressAnim(piece)
    local a = ANIM[piece]
    if not a then return end
    local ped = cache.ped or PlayerPedId()
    if IsEntityPlayingAnim(ped, a.dict, a.name, 3) then StopAnimTask(ped, a.dict, a.name, 1.0) end
    RemoveAnimDict(a.dict)
end

RegisterNUICallback('jrmyToggleClothing', function(data, cb)
    cb(1)

    local piece = data.piece
    local comp = COMPONENTS[piece]
    local prop = PROPS[piece]
    if not comp and not prop then return end

    if clothingBusy then return end
    clothingBusy = true

    CreateThread(function()
        pcall(function()
            local wait = playDressAnim(piece)
            if wait > 0 then Wait(wait) end

            local ped = cache.ped or PlayerPedId()
            local saved = savedClothing[piece]

            if prop then
                if saved then
                    if saved.drawable and saved.drawable ~= -1 then
                        SetPedPropIndex(ped, prop, saved.drawable, saved.texture or 0, true)
                    end
                    savedClothing[piece] = nil
                else
                    savedClothing[piece] = { drawable = GetPedPropIndex(ped, prop), texture = GetPedPropTextureIndex(ped, prop) }
                    ClearPedProp(ped, prop)
                end
            elseif saved then
                SetPedComponentVariation(ped, comp, saved.drawable, saved.texture, 0)
                savedClothing[piece] = nil
            else
                savedClothing[piece] = { drawable = GetPedDrawableVariation(ped, comp), texture = GetPedTextureVariation(ped, comp) }
                SetPedComponentVariation(ped, comp, EMPTY[comp] or 0, 0, 0)
            end

            if wait > 0 then
                Wait(400)
                stopDressAnim(piece)
            end
        end)

        clothingBusy = false
    end)
end)

RegisterNUICallback('jrmyMultijobGet', function(_, cb)
    cb(lib.callback.await('ox_inventory:jrmyMultijobGet', false) or { active = '', jobs = {}, max = 3 })
end)

RegisterNUICallback('jrmyMultijobSwitch', function(data, cb)
    cb(lib.callback.await('ox_inventory:jrmyMultijobSwitch', false, data.job) and 1 or 0)
end)

RegisterNUICallback('jrmyMultijobLeave', function(data, cb)
    cb(lib.callback.await('ox_inventory:jrmyMultijobLeave', false, data.job) and 1 or 0)
end)
