from flask import Flask, send_file, render_template, request, jsonify
import networkx as nx
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)

def generate_network_topology(branch_details):
    G = nx.Graph()

    branch_nodes = []
    sector_nodes = []
    computer_nodes = []

    for branch in branch_details:
        branch_name = branch['branch']
        sector = branch['sector']
        G.add_node(branch_name, type='branch')
        G.add_node(sector, type='sector')
        G.add_edge(branch_name, sector)

        branch_nodes.append(branch_name)
        sector_nodes.append(sector)

        num_of_com = branch['numOfCom']
        for i in range(num_of_com):
            computer_name = f"{branch_name} Computer {i + 1}"
            G.add_node(computer_name, type='computer')
            G.add_edge(sector, computer_name)
            computer_nodes.append(computer_name)

    pos = nx.spring_layout(G)
    plt.figure(figsize=(12, 8))

    nx.draw_networkx_nodes(G, pos, nodelist=branch_nodes, node_shape='s', node_color='red', node_size=2000, label='Branches')
    nx.draw_networkx_nodes(G, pos, nodelist=sector_nodes, node_shape='o', node_color='green', node_size=1000, label='Sectors')
    nx.draw_networkx_nodes(G, pos, nodelist=computer_nodes, node_shape='^', node_color='blue', node_size=500, label='Computers')

    nx.draw_networkx_edges(G, pos)
    nx.draw_networkx_labels(G, pos)

    plt.legend(scatterpoints=1)
    plt.axis('off')

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)

    return img

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/topology', methods=['POST'])
def topology():
    try:
        branch_details = request.get_json()
        logging.debug(f"Received branch details: {branch_details}")
        img = generate_network_topology(branch_details)
        img_base64 = base64.b64encode(img.read()).decode('utf-8')
        return jsonify(chart=img_base64)
    except Exception as e:
        logging.error(f"Error generating topology: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
