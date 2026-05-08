def move_down(state, pages):
	state["selected"] += 1
	if state["selected"] >= len(pages[state["page"]]):
		state["page"] = (state["page"] + 1) % len(pages)
		state["selected"] = 0
	state["needs_redraw"] = True

def select_item(state, pages):
	label, _ = pages[state["page"]][state["selected"]]
	state["pending_action"] = label
