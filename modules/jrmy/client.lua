-- =====================================================================
--  Jaramiyo inventory actions — client
--  Two extra actions for the inventory action menu:
--    · toggle hair  (native, no framework needed)
--    · multi-job    (bridges the NUI to the server; ESX / Qbox)
--  The server owns every multi-job decision and revalidates it, because a
--  NUI can be tampered with — the client only relays.
-- =====================================================================

-- Toggle the ped's hair on and off. Instant and fail-safe: it simply stores
-- the current hair (drawable + texture) and puts it back, so it can never get
-- stuck. Component 2 is hair; (0, 0) is the bald variation.
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

-- Toggle a clothing piece on/off, with the dressing animation. Native and
-- fail-safe: stores what was on and restores it, so a piece can never get
-- stuck. Each ped component has its own "empty" value (EMPTY below); using 0
-- for everything would just swap to a default outfit instead of removing it.
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
    -- flag 49 = upper-body partial, so the player can keep walking
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

    -- one piece at a time, or spamming chains animations into a weird pose
    if clothingBusy then return end
    clothingBusy = true

    CreateThread(function()
        -- pcall so clothingBusy is ALWAYS released, even if a native fails
        pcall(function()
            local wait = playDressAnim(piece)
            -- the garment changes MID-gesture, not at the start
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

-- Multi-job: the window asks for the list when it opens.
RegisterNUICallback('jrmyMultijobGet', function(_, cb)
    cb(lib.callback.await('ox_inventory:jrmyMultijobGet', false) or { active = '', jobs = {}, max = 3 })
end)

RegisterNUICallback('jrmyMultijobSwitch', function(data, cb)
    cb(lib.callback.await('ox_inventory:jrmyMultijobSwitch', false, data.job) and 1 or 0)
end)

RegisterNUICallback('jrmyMultijobLeave', function(data, cb)
    cb(lib.callback.await('ox_inventory:jrmyMultijobLeave', false, data.job) and 1 or 0)
end)
